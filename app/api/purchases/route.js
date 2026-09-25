import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getProgramme } from "@/lib/data";

export async function GET() {
  const me = await requireUser();
  const { purchases } = await collections();
  const rows = await purchases
    .find({ userId: new ObjectId(me.id) })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({
    purchases: rows.map((p) => ({
      id: String(p._id),
      programme_slug: p.programmeSlug,
      amount_pence: p.amountPence,
      payment_ref: p.paymentRef,
      status: p.status,
      completed_lessons: p.completedLessons ?? [],
      created_at: p.createdAt,
    })),
  });
}

export async function POST(req) {
  const me = await requireUser();
  const body = await req.json().catch(() => ({}));
  const slug = String(body.programme_slug || "");
  const programme = getProgramme(slug);
  if (!programme) return NextResponse.json({ error: "Unknown programme" }, { status: 400 });

  const { purchases } = await collections();
  const userId = new ObjectId(me.id);
  const existing = await purchases.findOne({ userId, programmeSlug: slug });
  if (existing) return NextResponse.json({ error: "Already owned", code: "DUPLICATE" }, { status: 409 });

  const ref = `demo_${Math.random().toString(36).slice(2, 12)}`;
  const { insertedId } = await purchases.insertOne({
    userId,
    programmeSlug: programme.slug,
    amountPence: programme.pricePence,
    paymentRef: ref,
    status: "paid",
    completedLessons: [],
    createdAt: new Date(),
  });
  return NextResponse.json({ id: String(insertedId), ref });
}