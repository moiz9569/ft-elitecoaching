import "server-only";
import nodemailer from "nodemailer";

let transporter;
function getTransport() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const t = getTransport();
  if (!t) {
    console.log(`[mailer] (no SMTP configured) → ${to}\nSubject: ${subject}\n\n${text}`);
    return;
  }
  await t.sendMail({
    from: process.env.SMTP_FROM || "no-reply@ftelitecoaching.com",
    to, subject, text, html,
  });
}