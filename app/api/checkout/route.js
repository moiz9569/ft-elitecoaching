import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getProgramme, getService } from "@/lib/data";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  const me = await requireUser();
  const body = await req.json().catch(() => ({}));
  const { type } = body;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    let session;

    // ─────────────────────────────────────────
    // PROGRAMME PURCHASE
    // ─────────────────────────────────────────
    if (type === "programme") {
      const programme = getProgramme(body.programme_slug);
      if (!programme) {
        return NextResponse.json(
          { error: "Unknown programme" },
          { status: 400 },
        );
      }

      session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              unit_amount: programme.pricePence,
              product_data: {
                name: programme.name,
                description: programme.tagline,
              },
            },
            quantity: 1,
          },
        ],
        customer_email: me.email,
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/checkout/${programme.slug}?canceled=1`,
        metadata: {
          type: "programme",
          userId: me.id,
          programmeSlug: programme.slug,
        },
      });
    }

    // ─────────────────────────────────────────
    // COACHING SESSION BOOKING
    // ─────────────────────────────────────────
    else if (type === "coaching") {
      const service = getService(body.service_slug);
      if (!service) {
        return NextResponse.json(
          { error: "Unknown session type" },
          { status: 400 },
        );
      }

      const pricePence = Math.round(
        parseFloat(service.price.replace(/[^0-9.]/g, "")) * 100,
      );

      const bookingDate = String(body.booking_date || "")
        .trim()
        .slice(0, 20);
      const bookingTime = String(body.booking_time || "")
        .trim()
        .slice(0, 10);
      const playerNotes = String(body.player_notes || "")
        .trim()
        .slice(0, 500);

      console.log("[checkout] coaching payload:", {
        bookingDate,
        bookingTime,
        playerNotes,
        serviceSlug: service.slug,
      });

      session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              unit_amount: pricePence,
              product_data: {
                name: service.name,
                description: `${service.tagline} · ${service.duration}`,
              },
            },
            quantity: 1,
          },
        ],
        customer_email: me.email,
        success_url: `${base}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/coaching/${service.slug}?canceled=1`,
        metadata: {
          type: "coaching",
          userId: me.id,
          serviceSlug: service.slug,
          bookingDate,
          bookingTime,
          playerNotes,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid checkout type" },
        { status: 400 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[stripe] checkout session failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
