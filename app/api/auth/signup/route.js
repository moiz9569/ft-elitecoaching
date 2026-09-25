import { NextResponse } from "next/server";
import { z } from "zod";
import { collections } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  full_name: z.string().trim().max(100).optional().default(""),
});

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password, full_name } = parsed.data;
  const { users, profiles } = await collections();

  const existing = await users.findOne({ email: email.toLowerCase() });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const now = new Date();
  const result = await users.insertOne({
    email: email.toLowerCase(),
    passwordHash,
    name: full_name,
    createdAt: now,
  });
  await profiles.insertOne({
    userId: result.insertedId,
    full_name,
    position: "",
    createdAt: now,
  });
  await createSession(result.insertedId);
  return NextResponse.json({ ok: true });
}