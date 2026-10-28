import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getService, getProgramme } from "@/lib/data";
import {
  sendOneOffDigitalEmail,
  sendOneOffAsyncEmail,
  sendSubscriptionWelcomeEmail,
  sendCoachNotification,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[stripe] signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { purchases, subscriptions, users } = await collections();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const meta = session.metadata || {};
      const userId = meta.userId;

      if (!userId) {
        console.error("[stripe] no userId in metadata");
        return NextResponse.json({ received: true });
      }

      const user = await users.findOne({ _id: new ObjectId(userId) });

      // ONE-OFF
      if (meta.type === "oneoff") {
        const item = getService(meta.itemSlug) || getProgramme(meta.itemSlug);
        if (!item) {
          console.error("[stripe] unknown item", meta.itemSlug);
          return NextResponse.json({ received: true });
        }

        const existing = await purchases.findOne({ stripeSessionId: session.id });
        if (existing) {
          console.log("[stripe] oneoff already recorded:", item.slug);
          return NextResponse.json({ received: true });
        }

        try {
          await purchases.insertOne({
            userId: new ObjectId(userId),
            itemSlug: item.slug,
            itemName: item.name,
            deliveryType: item.deliveryType || "digital",
            amountPence: session.amount_total,
            currency: session.currency || "eur",
            paymentRef: session.payment_intent || session.id,
            stripeSessionId: session.id,
            status: "paid",
            createdAt: new Date(),
          });
          console.log("✅ DB SAVED for oneoff:", item.slug);
        } catch (err) {
          if (err.code === 11000) {
            console.warn("[stripe] duplicate purchase skipped:", item.slug);
          } else {
            console.error("[stripe] oneoff insert failed:", err);
            return NextResponse.json({ error: "DB error" }, { status: 500 });
          }
        }

        if (user?.email) {
          console.log("📧 Attempting to send email to:", user.email);
          try {
            if (item.deliveryType === "digital") {
              await sendOneOffDigitalEmail({ to: user.email, name: user.name, item });
            } else {
              await sendOneOffAsyncEmail({ to: user.email, name: user.name, item });
            }
            console.log("✅ USER EMAIL SENT SUCCESSFULLY");
          } catch (emailErr) {
            console.error("❌ USER EMAIL FAILED:", emailErr.message);
          }

          try {
            await sendCoachNotification({
              customerEmail: user.email,
              customerName: user.name,
              item,
              amountPence: session.amount_total,
              currency: session.currency || "eur",
              ref: session.payment_intent || session.id,
            });
            console.log("✅ COACH EMAIL SENT SUCCESSFULLY");
          } catch (emailErr) {
            console.error("❌ COACH EMAIL FAILED:", emailErr.message);
          }
        } else {
          console.log("⚠️ No user email found in database for this user.");
        }
      }

      // SUBSCRIPTION
      if (meta.type === "subscription") {
        const item = getProgramme(meta.itemSlug);
        if (!item) {
          console.error("[stripe] unknown programme", meta.itemSlug);
          return NextResponse.json({ received: true });
        }

        let stripeSub = null;
        try {
          stripeSub = await stripe.subscriptions.retrieve(session.subscription);
        } catch (e) {
          console.error("[stripe] sub retrieve failed:", e.message);
        }

        const existing = await subscriptions.findOne({
          stripeSubscriptionId: session.subscription,
        });
        if (existing) {
          console.log("[stripe] subscription already recorded:", item.slug);
          return NextResponse.json({ received: true });
        }

        try {
          await subscriptions.insertOne({
            userId: new ObjectId(userId),
            itemSlug: item.slug,
            itemName: item.name,
            stripeSubscriptionId: session.subscription,
            stripeCustomerId: session.customer,
            status: stripeSub?.status || "active",
            currentPeriodEnd: stripeSub ? new Date(stripeSub.current_period_end * 1000) : null,
            amountPence: session.amount_total,
            currency: session.currency || "eur",
            createdAt: new Date(),
          });
          console.log("✅ DB SAVED for subscription:", item.slug);
        } catch (err) {
          if (err.code === 11000) {
            console.warn("[stripe] duplicate subscription skipped:", item.slug);
          } else {
            console.error("[stripe] subscription insert failed:", err);
            return NextResponse.json({ error: "DB error" }, { status: 500 });
          }
        }

        if (user?.email) {
          console.log("📧 Attempting to send SUB email to:", user.email);
          try {
            await sendSubscriptionWelcomeEmail({ to: user.email, name: user.name, item });
            console.log("✅ USER SUB EMAIL SENT");
          } catch (emailErr) {
            console.error("❌ USER SUB EMAIL FAILED:", emailErr.message);
          }

          try {
            await sendCoachNotification({
              customerEmail: user.email,
              customerName: user.name,
              item,
              amountPence: session.amount_total,
              currency: session.currency || "eur",
              ref: session.subscription,
            });
            console.log("✅ COACH SUB EMAIL SENT");
          } catch (emailErr) {
            console.error("❌ COACH SUB EMAIL FAILED:", emailErr.message);
          }
        }
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      if (invoice.subscription) {
        try {
          const stripeSub = await stripe.subscriptions.retrieve(invoice.subscription);
          await subscriptions.updateOne(
            { stripeSubscriptionId: invoice.subscription },
            {
              $set: {
                status: stripeSub.status,
                currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
                lastInvoicePaidAt: new Date(),
              },
            }
          );
        } catch (err) {
          console.error("[stripe] invoice.paid sync failed:", err.message);
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      try {
        await subscriptions.updateOne(
          { stripeSubscriptionId: sub.id },
          { $set: { status: "canceled", canceledAt: new Date() } }
        );
      } catch (err) {
        console.error("[stripe] cancel sync failed:", err.message);
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      if (invoice.subscription) {
        try {
          await subscriptions.updateOne(
            { stripeSubscriptionId: invoice.subscription },
            { $set: { status: "past_due" } }
          );
        } catch (err) {
          console.error("[stripe] past_due sync failed:", err.message);
        }
      }
    }
  } catch (err) {
    console.error("[stripe] webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}