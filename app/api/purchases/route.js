import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getService } from "@/lib/data";

export async function GET() {
  const me = await requireUser();
  const { purchases } = await collections();

  const rows = await purchases
    .find({ userId: new ObjectId(me.id) })
    .sort({ createdAt: -1 })
    .toArray();

  // Filter out legacy purchases that don't map to a current service
  const valid = rows.filter((p) => {
    if (!p.itemSlug) return false; // old shape (programmeSlug, no itemSlug)
    return Boolean(getService(p.itemSlug)); // must match a current service
  });

  return NextResponse.json({
    purchases: valid.map((p) => ({
      id: String(p._id),
      itemSlug: p.itemSlug,
      itemName: p.itemName,
      deliveryType: p.deliveryType || "digital",
      amountPence: p.amountPence,
      currency: p.currency || "eur",
      paymentRef: p.paymentRef || null,
      status: p.status || "paid",
      createdAt: p.createdAt,
    })),
  });
}