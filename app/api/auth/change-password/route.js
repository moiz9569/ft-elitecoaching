import { NextResponse } from "next/server";
import { z } from "zod";
import { collections } from "@/lib/db";
import { requireUser, hashPassword, verifyPassword } from "@/lib/auth";

const schema = z.object({
  current_password: z.string().min(1),
  password: z.string().min(8).max(72),
});

export async function POST(req) {
  const me = await requireUser();
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { users } = await collections();
  const user = await users.findOne({ _id: new (await import("mongodb")).ObjectId(me.id) });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Password change not available for this account" }, { status: 400 });
  }
  const ok = await verifyPassword(parsed.data.current_password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  await users.updateOne(
    { _id: user._id },
    { $set: { passwordHash: await hashPassword(parsed.data.password) } }
  );
  return NextResponse.json({ ok: true });
}