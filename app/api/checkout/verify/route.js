import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getService, getProgramme } from "@/lib/data";
import { requireUser } from "@/lib/auth";

export async function GET(req) {
  const me = await requireUser();
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const meta = session.metadata || {};

    if (meta.userId !== me.id) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    // ONE-OFF
    if (meta.type === "oneoff") {
      if (session.payment_status !== "paid") {
        return NextResponse.json({ ok: false, error: "Not paid" }, { status: 400 });
      }
      const item = getService(meta.itemSlug) || getProgramme(meta.itemSlug);
      return NextResponse.json({
        ok: true,
        type: "oneoff",
        itemName: item?.name,
        itemSlug: item?.slug,
        deliveryType: item?.deliveryType || "digital",
        customerEmail: session.customer_details?.email || "",
        ref: session.payment_intent || session.id,
      });
    }

    // SUBSCRIPTION
    if (meta.type === "subscription") {
      const item = getProgramme(meta.itemSlug);
      return NextResponse.json({
        ok: true,
        type: "subscription",
        itemName: item?.name,
        itemSlug: item?.slug,
        customerEmail: session.customer_details?.email || "",
        ref: session.subscription || session.id,
      });
    }

    return NextResponse.json({ ok: false, error: "Unknown type" }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 400 });
  }
}