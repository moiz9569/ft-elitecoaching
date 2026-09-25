import { NextResponse } from "next/server";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const me = await requireUser();
  const uid = new ObjectId(me.id);
  const { profiles } = await collections();
  const p = await profiles.findOne({ userId: uid });
  return NextResponse.json({
    profile: {
      id: me.id,
      email: me.email,
      full_name: p?.full_name ?? "",
      position: p?.position ?? "",
    },
  });
}

const updateSchema = z.object({
  full_name: z.string().trim().max(100).optional().default(""),
  position: z.string().max(30).optional().default(""),
});

export async function PATCH(req) {
  const me = await requireUser();
  const parsed = updateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { profiles } = await collections();
  await profiles.updateOne(
    { userId: new ObjectId(me.id) },
    { $set: { full_name: parsed.data.full_name, position: parsed.data.position }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ ok: true });
}