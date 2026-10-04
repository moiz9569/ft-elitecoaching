import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const me = await requireUser();
  const { subscriptions } = await collections();

  const sub = await subscriptions.findOne({
    userId: new ObjectId(me.id),
    stripeCustomerId: { $exists: true, $ne: null },
  });

  if (!sub?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No subscription found for this account" },
      { status: 400 }
    );
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${base}/my-subscriptions`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] portal session failed:", err);
    return NextResponse.json(
      { error: "Could not open billing portal" },
      { status: 500 }
    );
  }
}