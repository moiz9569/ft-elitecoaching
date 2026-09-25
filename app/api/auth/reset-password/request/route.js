import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { collections } from "@/lib/db";
import { sendMail } from "@/lib/mailer";

const schema = z.object({ email: z.string().trim().email().max(255) });

export async function POST(req) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  const { users, passwordResets } = await collections();
  const user = await users.findOne({ email: parsed.data.email.toLowerCase() });

  // Always return ok to avoid email enumeration.
  if (user) {
    const token = randomBytes(32).toString("hex");
    await passwordResets.insertOne({
      token,
      userId: user._id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const link = `${base}/reset-password?token=${token}`;
    await sendMail({
      to: user.email,
      subject: "Reset your FT Elite password",
      text: `Click to set a new password: ${link}`,
      html: `<p>Click to set a new password:</p><p><a href="${link}">${link}</a></p>`,
    });
  }
  return NextResponse.json({ ok: true });
}