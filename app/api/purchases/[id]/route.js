import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const me = await requireUser();
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const completedLessons = Array.isArray(body.completed_lessons)
    ? body.completed_lessons.slice(0, 500).map((s) => String(s).slice(0, 64))
    : null;
  if (!completedLessons) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { purchases } = await collections();
  const res = await purchases.updateOne(
    { _id: new ObjectId(id), userId: new ObjectId(me.id) },
    { $set: { completedLessons } }
  );
  if (res.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}