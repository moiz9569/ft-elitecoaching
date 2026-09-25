import { NextResponse } from "next/server";
import { z } from "zod";
import { collections } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
});

export async function POST(req) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { users } = await collections();
  const user = await users.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  await createSession(user._id);
  return NextResponse.json({ ok: true });
}