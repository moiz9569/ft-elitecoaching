import { NextResponse } from "next/server";
import { z } from "zod";
import { collections } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  topic: z.string().max(50).optional().default(""),
  message: z.string().trim().min(1).max(2000),
});

export async function POST(req) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { contactMessages } = await collections();
  await contactMessages.insertOne({ ...parsed.data, createdAt: new Date() });
  return NextResponse.json({ ok: true });
}