import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getService, getProgramme } from "@/lib/data";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  const me = await requireUser();
  const body = await req.json().catch(() => ({}));
  const { slug } = body;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const item = getService(slug) || getProgramme(slug);
  if (!item) {
    return NextResponse.json({ error: "Unknown item" }, { status: 400 });
  }

  try {
    let session;

    // ─────────────────────────────────────────
    // ONE-OFF PAYMENT
    // ─────────────────────────────────────────
    if (item.checkout === "oneoff") {
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: item.currency || "eur",
              unit_amount: item.pricePence,
              product_data: {
                name: item.name,
                description: item.tagline,
              },
            },
            quantity: 1,
          },
        ],
        customer_email: me.email,
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/coaching/${item.slug}?canceled=1`,
        metadata: {
          type: "oneoff",
          userId: me.id,
          itemSlug: item.slug,
          deliveryType: item.deliveryType || "digital",
        },
      });
    }

    // ─────────────────────────────────────────
    // MONTHLY SUBSCRIPTION
    // ─────────────────────────────────────────
    else if (item.checkout === "subscription") {
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: item.currency || "eur",
              unit_amount: item.pricePence,
              recurring: { interval: item.interval || "month" },
              product_data: {
                name: item.name,
                description: item.tagline,
              },
            },
            quantity: 1,
          },
        ],
        customer_email: me.email,
        success_url: `${base}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/programmes/${item.slug}?canceled=1`,
        metadata: {
          type: "subscription",
          userId: me.id,
          itemSlug: item.slug,
        },
      });
    } else {
      return NextResponse.json({ error: "Unknown checkout type" }, { status: 400 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[stripe] checkout session failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}