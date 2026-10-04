import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const me = await requireUser();
  const { subscriptions } = await collections();
  const rows = await subscriptions
    .find({ userId: new ObjectId(me.id) })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    subscriptions: rows.map((s) => ({
      id: String(s._id),
      itemSlug: s.itemSlug,
      itemName: s.itemName,
      status: s.status,
      currentPeriodEnd: s.currentPeriodEnd,
      amountPence: s.amountPence,
      currency: s.currency || "eur",
      canceledAt: s.canceledAt || null,
      createdAt: s.createdAt,
    })),
  });
}