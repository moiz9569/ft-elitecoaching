import "server-only";
import nodemailer from "nodemailer";

let transporter;
function getTransport() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER) {
    console.warn("[email] SMTP not configured — emails will be skipped");
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

async function send({ to, subject, html, text }) {
  const t = getTransport();
  if (!t) {
    console.log(`[email skipped] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await t.sendMail({
      from:
        process.env.SMTP_FROM ||
        `"FT Elite Coaching" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`[email sent] To: ${to} | Subject: ${subject}`);
  } catch (err) {
    console.error("[email] send failed:", err.message);
  }
}

function safe(v, fallback = "To be confirmed") {
  if (v == null) return fallback;
  const s = String(v).trim();
  if (!s || s === "undefined" || s === "null") return fallback;
  return s;
}

// ─────────────────────────────────────────
// CUSTOMER — purchase confirmation
// ─────────────────────────────────────────
export async function sendPurchaseEmail({ to, name, programme }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  await send({
    to,
    subject: `You're in — ${programme.name}`,
    text: `Hi ${name},\n\nYour purchase is confirmed: ${programme.name}.\n\nStart training: ${base}/learn/${programme.slug}\n\n— FT Elite Coaching`,
    html: wrap(`
      <h1 style="font-family:Impact,sans-serif;font-size:40px;margin:0 0 16px;">You're in.</h1>
      <p style="font-size:16px;color:#333;">Hi ${name},</p>
      <p style="font-size:16px;color:#333;">Your purchase is confirmed. <strong>${programme.name}</strong> is now unlocked in your dashboard.</p>
      <a href="${base}/learn/${programme.slug}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 28px;text-decoration:none;font-weight:700;margin-top:16px;border-radius:4px;">Start training →</a>
      <p style="font-size:13px;color:#888;margin-top:32px;">14-day money-back guarantee. Reply to this email if you have any questions.</p>
    `),
  });
}

// ─────────────────────────────────────────
// CUSTOMER — booking confirmation with Meet link
// ─────────────────────────────────────────
export async function sendBookingEmail({
  to,
  name,
  service,
  bookingDate,
  bookingTime,
  notes,
  ref,
}) {
  const meetLink = service.meetLink || "";
  const dDate = safe(bookingDate);
  const dTime = safe(bookingTime);

  await send({
    to,
    subject: `Booking confirmed — ${service.name} (${dDate} at ${dTime})`,
    text: `Hi ${name},

Your booking is confirmed.

Session:  ${service.name}
Date:     ${dDate}
Time:     ${dTime}
Duration: ${service.duration}

Join here: ${meetLink}

Order ref: ${ref}
${notes ? `\nYour notes: ${notes}\n` : ""}
Save this email — the link above is your meeting room.

— FT Elite Coaching`,
    html: wrap(`
      <h1 style="font-family:Impact,sans-serif;font-size:40px;margin:0 0 16px;">Booking confirmed.</h1>
      <p style="font-size:16px;color:#333;">Hi ${name},</p>
      <p style="font-size:16px;color:#333;">Your session is locked in.</p>

      <table style="margin:24px 0;border-collapse:collapse;width:100%;font-size:15px;">
        <tr><td style="padding:8px 0;color:#888;">Session</td><td style="padding:8px 0;font-weight:600;">${service.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Date</td><td style="padding:8px 0;font-weight:600;">${dDate}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Time</td><td style="padding:8px 0;font-weight:600;">${dTime}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Duration</td><td style="padding:8px 0;font-weight:600;">${service.duration}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Order ref</td><td style="padding:8px 0;font-family:monospace;font-size:13px;">${ref}</td></tr>
      </table>

      <div style="background:#f0f4ff;border-left:3px solid #2563eb;padding:20px;margin:24px 0;text-align:center;">
        <p style="font-size:14px;color:#333;margin:0 0 12px;font-weight:600;">Your Google Meet link</p>
        <a href="${meetLink}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 28px;text-decoration:none;font-weight:700;border-radius:4px;">Join the session →</a>
        <p style="font-size:12px;color:#666;margin:12px 0 0;word-break:break-all;">${meetLink}</p>
      </div>

      <p style="font-size:14px;color:#666;margin-top:24px;">Join the link at your scheduled time. Test your camera and mic a couple of minutes before.</p>
      ${notes ? `<p style="font-size:14px;color:#666;margin-top:16px;"><strong>Your notes:</strong> ${notes}</p>` : ""}
      <p style="font-size:13px;color:#888;margin-top:24px;">Any questions? Just reply to this email.</p>
    `),
  });
}

// ─────────────────────────────────────────
// COACH — new booking notification with Meet link
// ─────────────────────────────────────────
export async function sendCoachBookingNotification({
  customerEmail,
  customerName,
  service,
  bookingDate,
  bookingTime,
  notes,
  ref,
  amountPence,
}) {
  const to = process.env.COACH_EMAIL;
  if (!to) {
    console.warn("[email] COACH_EMAIL not set — coach notification skipped");
    return;
  }

  const amount = `£${(amountPence / 100).toFixed(2)}`;
  const meetLink = service.meetLink || "";
  const dDate = safe(bookingDate);
  const dTime = safe(bookingTime);

  await send({
    to,
    subject: `🎯 New booking — ${service.name} (${dDate} ${dTime})`,
    text: [
      `New booking confirmed.`,
      ``,
      `Customer: ${customerName} <${customerEmail}>`,
      `Session:  ${service.name} (${service.duration})`,
      `Date:     ${dDate}`,
      `Time:     ${dTime}`,
      `Amount:   ${amount}`,
      `Ref:      ${ref}`,
      `Meet:     ${meetLink}`,
      notes ? `\nCustomer notes:\n${notes}` : "",
    ].join("\n"),
    html: wrap(`
      <h2 style="font-family:Impact,sans-serif;font-size:28px;margin:0 0 20px;">New booking</h2>
      <table style="border-collapse:collapse;width:100%;font-size:15px;">
        <tr><td style="padding:10px 0;color:#888;width:120px;">Customer</td><td style="padding:10px 0;"><strong>${customerName}</strong> &lt;${customerEmail}&gt;</td></tr>
        <tr><td style="padding:10px 0;color:#888;">Session</td><td style="padding:10px 0;">${service.name} · ${service.duration}</td></tr>
        <tr><td style="padding:10px 0;color:#888;">Date</td><td style="padding:10px 0;font-weight:600;">${dDate}</td></tr>
        <tr><td style="padding:10px 0;color:#888;">Time</td><td style="padding:10px 0;font-weight:600;">${dTime}</td></tr>
        <tr><td style="padding:10px 0;color:#888;">Amount</td><td style="padding:10px 0;font-weight:600;">${amount}</td></tr>
        <tr><td style="padding:10px 0;color:#888;">Ref</td><td style="padding:10px 0;font-family:monospace;font-size:12px;">${ref}</td></tr>
      </table>

      <div style="background:#f0f4ff;border-left:3px solid #2563eb;padding:16px;margin:24px 0;">
        <p style="font-size:13px;color:#666;margin:0 0 6px;">Google Meet link (also sent to the customer):</p>
        <a href="${meetLink}" style="font-size:14px;font-weight:600;color:#2563eb;word-break:break-all;">${meetLink}</a>
      </div>

      ${notes ? `<div style="background:#f5f5f5;padding:16px;margin-top:24px;"><strong>Customer notes:</strong><br>${notes}</div>` : ""}
    `),
  });
}

function wrap(body) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <div style="background:#fff;padding:40px;border:1px solid #e5e5e5;">
        <div style="font-family:Impact,sans-serif;font-size:18px;color:#2563eb;margin-bottom:32px;">FT ELITE COACHING</div>
        ${body}
      </div>
      <p style="text-align:center;font-size:12px;color:#999;margin-top:24px;">FT Elite Coaching · hello@ftelitecoaching.com</p>
    </div>
  </body></html>`;
}
