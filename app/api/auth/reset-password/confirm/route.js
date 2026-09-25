import { NextResponse } from "next/server";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  token: z.string().min(16),
  password: z.string().min(8).max(72),
});

export async function POST(req) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { passwordResets, users } = await collections();
  const rec = await passwordResets.findOne({ token: parsed.data.token });
  if (!rec || rec.expiresAt < new Date()) {
    return NextResponse.json({ error: "Reset link expired or invalid" }, { status: 400 });
  }
  await users.updateOne(
    { _id: new ObjectId(rec.userId) },
    { $set: { passwordHash: await hashPassword(parsed.data.password) } }
  );
  await passwordResets.deleteOne({ _id: rec._id });
  return NextResponse.json({ ok: true });
}