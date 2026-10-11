import { NextResponse } from "next/server";
import { collections } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const base = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  if (!code) return NextResponse.redirect(`${base}/auth?error=google`);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${base}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return NextResponse.redirect(`${base}/auth?error=google`);
  const tokens = await tokenRes.json();

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profileRes.ok) return NextResponse.redirect(`${base}/auth?error=google`);
  const info = await profileRes.json();
  const email = (info.email || "").toLowerCase();
  if (!email) return NextResponse.redirect(`${base}/auth?error=google`);

  const { users, profiles } = await collections();
  let user = await users.findOne({ email });
  if (!user) {
    const now = new Date();
    const { insertedId } = await users.insertOne({
      email,
      passwordHash: null,
      name: info.name || "",
      googleId: info.sub,
      createdAt: now,
    });
    await profiles.insertOne({
      userId: insertedId,
      full_name: info.name || "",
      position: "",
      createdAt: now,
    });
    user = { _id: insertedId };
  }
  await createSession(user._id);
  return NextResponse.redirect(`${base}/dashboard`);
}