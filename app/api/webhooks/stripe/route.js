import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getProgramme, getService } from "@/lib/data";
import {
  sendPurchaseEmail,
  sendBookingEmail,
  sendCoachBookingNotification,
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
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("[stripe] webhook signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata || {};

    console.log("[stripe] webhook metadata:", JSON.stringify(meta));

    const userId = meta.userId;
    if (!userId) {
      console.error("[stripe] webhook missing userId", session.id);
      return NextResponse.json({ received: true });
    }

    const { purchases, bookings, users } = await collections();

    // ─────────────────────────────────────────
    // PROGRAMME PURCHASE
    // ─────────────────────────────────────────
    if (meta.type === "programme") {
      const programme = getProgramme(meta.programmeSlug);
      if (!programme) {
        console.error("[stripe] unknown programme", meta.programmeSlug);
        return NextResponse.json({ received: true });
      }

      const existing = await purchases.findOne({ stripeSessionId: session.id });
      if (existing) return NextResponse.json({ received: true });

      try {
        await purchases.insertOne({
          userId: new ObjectId(userId),
          programmeSlug: programme.slug,
          amountPence: session.amount_total,
          paymentRef: session.payment_intent || session.id,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent || null,
          status: "paid",
          completedLessons: [],
          createdAt: new Date(),
        });
      } catch (err) {
        if (err.code === 11000) {
          console.log("[stripe] user already owns", programme.slug);
        } else {
          console.error("[stripe] purchase insert failed:", err);
          return NextResponse.json({ error: "DB error" }, { status: 500 });
        }
      }

      const user = await users.findOne({ _id: new ObjectId(userId) });
      if (user?.email) {
        sendPurchaseEmail({
          to: user.email,
          name: user.name || "there",
          programme,
        }).catch((e) => console.error("[email] purchase confirm failed:", e));
      }
    }

    // ─────────────────────────────────────────
    // COACHING BOOKING
    // ─────────────────────────────────────────
    else if (meta.type === "coaching") {
      const service = getService(meta.serviceSlug);
      if (!service) {
        console.error("[stripe] unknown service", meta.serviceSlug);
        return NextResponse.json({ received: true });
      }

      const existing = await bookings.findOne({ stripeSessionId: session.id });
      if (existing) return NextResponse.json({ received: true });

      try {
        await bookings.insertOne({
          userId: new ObjectId(userId),
          serviceSlug: service.slug,
          serviceName: service.name,
          amountPence: session.amount_total,
          paymentRef: session.payment_intent || session.id,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent || null,
          status: "confirmed",
          bookingDate: meta.bookingDate || null,
          bookingTime: meta.bookingTime || null,
          playerNotes: meta.playerNotes || "",
          createdAt: new Date(),
        });
      } catch (err) {
        console.error("[stripe] booking insert failed:", err);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }

      const user = await users.findOne({ _id: new ObjectId(userId) });
      if (user?.email) {
        sendBookingEmail({
          to: user.email,
          name: user.name || "there",
          service,
          bookingDate: meta.bookingDate,
          bookingTime: meta.bookingTime,
          notes: meta.playerNotes,
          ref: session.payment_intent || session.id,
        }).catch((e) => console.error("[email] booking confirm failed:", e));

        sendCoachBookingNotification({
          customerEmail: user.email,
          customerName: user.name || "Player",
          service,
          bookingDate: meta.bookingDate,
          bookingTime: meta.bookingTime,
          notes: meta.playerNotes,
          ref: session.payment_intent || session.id,
          amountPence: session.amount_total,
        }).catch((e) => console.error("[email] coach notify failed:", e));
      }
    }
  }

  return NextResponse.json({ received: true });
}
