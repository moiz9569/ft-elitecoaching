import "server-only";
import nodemailer from "nodemailer";
import { COACH_WHATSAPP, COACH_NAME } from "@/lib/data";

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
    console.log(`[email skipped] To: ${to} | ${subject}`);
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
    console.log(`[email sent] To: ${to} | ${subject}`);
  } catch (err) {
    console.error("[email] send failed:", err.message);
  }
}

const money = (pence, currency = "eur") => {
  const sym = currency === "eur" ? "€" : currency === "gbp" ? "£" : "$";
  return `${sym}${(pence / 100).toFixed(2)}`;
};

// ─────────────────────────────────────────
// LAYOUT WRAPPER
// ─────────────────────────────────────────
function wrap(body) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;color:#111;">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

      <div style="background:#fff;border:1px solid #e5e5e5;padding:44px 40px;">
        <div style="font-family:Impact,'Arial Narrow',sans-serif;font-size:20px;letter-spacing:0.5px;color:#2563eb;margin-bottom:36px;">
          FT ELITE COACHING
        </div>
        ${body}
      </div>

      <p style="text-align:center;font-size:12px;color:#999;margin-top:24px;line-height:1.6;">
        FT Elite Coaching · hello@ftelitecoaching.com<br/>
        You're receiving this because you made a purchase on our site.
      </p>

    </div>
  </body>
</html>`;
}

const cta = (href, label, color = "#2563eb") =>
  `<a href="${href}" style="display:inline-block;background:${color};color:#fff;padding:14px 32px;text-decoration:none;font-weight:700;font-size:15px;border-radius:4px;letter-spacing:0.3px;">${label}</a>`;

const infoBox = (label, body, color = "#2563eb", bg = "#eff6ff") => `
  <div style="background:${bg};border-left:3px solid ${color};padding:20px;margin:28px 0;">
    ${label ? `<p style="font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${color};margin:0 0 10px;">${label}</p>` : ""}
    ${body}
  </div>
`;

const divider = `<hr style="border:none;border-top:1px solid #eaeaea;margin:32px 0;" />`;

// ─────────────────────────────────────────
// ONE-OFF: DIGITAL DELIVERY (Ball Mastery)
// ─────────────────────────────────────────
export async function sendOneOffDigitalEmail({ to, name, item }) {
  const driveLink = item.driveLink || "#";
  const firstName = (name || "there").split(" ")[0];

  await send({
    to,
    subject: `Your Ball Mastery library is ready 🎯`,
    text: `Hi ${firstName},

Thanks for your purchase of ${item.name}.

Your library is ready — click the link below to open it:
${driveLink}

What's inside:
${item.includes.map((x) => `• ${x}`).join("\n")}

The library is yours to keep. Bookmark the link so you can find it easily.

Questions? Message me on WhatsApp: ${COACH_WHATSAPP}

— ${COACH_NAME}
FT Elite Coaching`,
    html: wrap(`
      <h1 style="font-family:Impact,'Arial Narrow',sans-serif;font-size:42px;line-height:1;margin:0 0 8px;letter-spacing:0.5px;">
        Your library is ready.
      </h1>
      <p style="font-size:16px;color:#666;margin:0 0 28px;">
        Thanks for picking up <strong style="color:#111;">${item.name}</strong>.
      </p>

      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 8px;">
        Hi ${firstName},
      </p>
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px;">
        Your full skill library is ready to access. Everything you need to start training is one click away.
      </p>

      ${infoBox(
        "Your access link",
        `<div style="text-align:center;">
          ${cta(driveLink, "Open the library →")}
          <p style="font-size:12px;color:#666;margin:14px 0 0;word-break:break-all;">${driveLink}</p>
        </div>`
      )}

      <h2 style="font-family:Impact,'Arial Narrow',sans-serif;font-size:20px;letter-spacing:0.5px;margin:32px 0 14px;">
        What's inside
      </h2>
      <ul style="padding:0;margin:0;list-style:none;">
        ${item.includes
          .map(
            (x) => `
          <li style="font-size:15px;color:#333;padding:8px 0 8px 22px;position:relative;line-height:1.5;">
            <span style="position:absolute;left:0;top:8px;color:#2563eb;font-weight:700;">✓</span>
            ${x}
          </li>`
          )
          .join("")}
      </ul>

      ${divider}

      <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">
        <strong>Bookmark the link</strong> — it's yours to keep and won't expire.
        Train at your own pace, and come back to any skill whenever you need it.
      </p>

      ${infoBox(
        "Need help?",
        `<p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 12px;">
          Any questions about the skills or how to train them? Reach out any time.
        </p>
        <div style="text-align:center;">${cta(COACH_WHATSAPP, "Message me on WhatsApp →", "#25d366")}</div>`,
        "#25d366",
        "#f0fdf4"
      )}

      <p style="font-size:15px;color:#333;line-height:1.6;margin:0;">
        Good luck with the training — looking forward to seeing your progress.
      </p>
      <p style="font-size:15px;color:#333;line-height:1.6;margin:16px 0 0;">
        — ${COACH_NAME}<br/>
        <span style="color:#888;">FT Elite Coaching</span>
      </p>
    `),
  });
}

// ─────────────────────────────────────────
// ONE-OFF: ASYNC DELIVERY (Match Analysis)
// ─────────────────────────────────────────
export async function sendOneOffAsyncEmail({ to, name, item }) {
  const whatsapp = item.whatsapp || COACH_WHATSAPP;
  const contactEmail = item.contactEmail || "hello@ftelitecoaching.com";
  const firstName = (name || "there").split(" ")[0];

  const isMulti = item.slug === "match-analysis-4";

  await send({
    to,
    subject: `Let's get your match analysis started 📹`,
    text: `Hi ${firstName},

Thanks for your purchase of ${item.name}.

Next step: send me your match footage.

The easiest way is WhatsApp: ${whatsapp}

Or email: ${contactEmail}

Once I have the footage, I'll get to work and send you back a personalised video analysis${isMulti ? " for each game, plus a combined report at the end" : ""}.

Here's what you'll get:
${item.includes.map((x) => `• ${x}`).join("\n")}

— ${COACH_NAME}
FT Elite Coaching`,
    html: wrap(`
      <h1 style="font-family:Impact,'Arial Narrow',sans-serif;font-size:42px;line-height:1;margin:0 0 8px;letter-spacing:0.5px;">
        Let's get started.
      </h1>
      <p style="font-size:16px;color:#666;margin:0 0 28px;">
        Your <strong style="color:#111;">${item.name}</strong> is confirmed.
      </p>

      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 8px;">
        Hi ${firstName},
      </p>
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px;">
        Thanks for your purchase. One quick step and I'll get straight to work on your analysis.
      </p>

      ${infoBox(
        "Send me your match footage",
        `<p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">
          The easiest way is WhatsApp — just drop the file or a link to the recording.
        </p>
        <div style="text-align:center;">
          ${cta(whatsapp, "Send footage on WhatsApp →", "#25d366")}
        </div>
        <p style="font-size:13px;color:#666;margin:14px 0 0;text-align:center;">
          Or email: <a href="mailto:${contactEmail}" style="color:#2563eb;text-decoration:none;">${contactEmail}</a>
        </p>`,
        "#25d366",
        "#f0fdf4"
      )}

      <h2 style="font-family:Impact,'Arial Narrow',sans-serif;font-size:20px;letter-spacing:0.5px;margin:32px 0 14px;">
        What you'll get back
      </h2>
      <ul style="padding:0;margin:0;list-style:none;">
        ${item.includes
          .map(
            (x) => `
          <li style="font-size:15px;color:#333;padding:8px 0 8px 22px;position:relative;line-height:1.5;">
            <span style="position:absolute;left:0;top:8px;color:#2563eb;font-weight:700;">✓</span>
            ${x}
          </li>`
          )
          .join("")}
      </ul>

      ${divider}

      <p style="font-size:15px;color:#333;line-height:1.6;margin:0;">
        Turnaround is usually a few days from when I receive the footage. If you have any questions before sending, just message me.
      </p>
      <p style="font-size:15px;color:#333;line-height:1.6;margin:16px 0 0;">
        — ${COACH_NAME}<br/>
        <span style="color:#888;">FT Elite Coaching</span>
      </p>
    `),
  });
}

// ─────────────────────────────────────────
// SUBSCRIPTION WELCOME
// ─────────────────────────────────────────
export async function sendSubscriptionWelcomeEmail({ to, name, item }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const firstName = (name || "there").split(" ")[0];

  const isMentorship = item.slug === "football-mentorship";
  const nextStep = isMentorship
    ? `${COACH_NAME} will email you shortly to schedule your first session. From there, you'll meet monthly to work on your goals, career and personal brand.`
    : `${COACH_NAME} will email you shortly with your first month's skills, videos and personal challenges. From there, you'll get fresh content every month.`;

  await send({
    to,
    subject: `Welcome to ${item.name} ⚽`,
    text: `Hi ${firstName},

Your ${item.name} subscription is now active. Welcome to the squad.

${nextStep}

If you'd like to introduce yourself or ask anything, message me on WhatsApp: ${COACH_WHATSAPP}

Manage your subscription any time: ${base}/my-subscriptions

Billed monthly. Cancel whenever you want — no minimum commitment.

— ${COACH_NAME}
FT Elite Coaching`,
    html: wrap(`
      <h1 style="font-family:Impact,'Arial Narrow',sans-serif;font-size:42px;line-height:1;margin:0 0 8px;letter-spacing:0.5px;">
        Welcome to the squad.
      </h1>
      <p style="font-size:16px;color:#666;margin:0 0 28px;">
        Your <strong style="color:#111;">${item.name}</strong> subscription is live.
      </p>

      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 8px;">
        Hi ${firstName},
      </p>
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px;">
        Thanks for subscribing. You're in — here's what happens next.
      </p>

      ${infoBox(
        "Next step",
        `<p style="font-size:15px;color:#333;line-height:1.6;margin:0;">
          ${nextStep}
        </p>`
      )}

      <h2 style="font-family:Impact,'Arial Narrow',sans-serif;font-size:20px;letter-spacing:0.5px;margin:32px 0 14px;">
        What's included every month
      </h2>
      <ul style="padding:0;margin:0;list-style:none;">
        ${item.includes
          .map(
            (x) => `
          <li style="font-size:15px;color:#333;padding:8px 0 8px 22px;position:relative;line-height:1.5;">
            <span style="position:absolute;left:0;top:8px;color:#2563eb;font-weight:700;">✓</span>
            ${x}
          </li>`
          )
          .join("")}
      </ul>

      ${divider}

      <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">
        Want to say hi, ask a question, or share your goals before we start? Message me directly — I read every message.
      </p>

      ${infoBox(
        "Reach me on WhatsApp",
        `<div style="text-align:center;">${cta(COACH_WHATSAPP, `Message ${COACH_NAME} →`, "#25d366")}</div>`,
        "#25d366",
        "#f0fdf4"
      )}

      <div style="text-align:center;margin:32px 0 8px;">
        ${cta(`${base}/my-subscriptions`, "Manage subscription →")}
      </div>

      <p style="font-size:13px;color:#888;text-align:center;margin:12px 0 0;line-height:1.6;">
        Billed monthly · Cancel any time · No minimum commitment
      </p>

      <p style="font-size:15px;color:#333;line-height:1.6;margin:24px 0 0;">
        — ${COACH_NAME}<br/>
        <span style="color:#888;">FT Elite Coaching</span>
      </p>
    `),
  });
}

// ─────────────────────────────────────────
// COACH NOTIFICATION (admin)
// ─────────────────────────────────────────
export async function sendCoachNotification({
  customerEmail,
  customerName,
  item,
  amountPence,
  currency,
  ref,
}) {
  const to = process.env.COACH_EMAIL;
  if (!to) return;

  const isSubscription = item.checkout === "subscription";
  const badge = isSubscription ? "SUBSCRIPTION" : "ONE-OFF";
  const badgeColor = isSubscription ? "#7c3aed" : "#2563eb";

  const customerDisplay = customerName || customerEmail.split("@")[0];

  // WhatsApp click-to-chat link from the customer's perspective isn't possible
  // (we only have their email), so we show their email as the primary contact.
  const whatsappToCustomer = null;

  await send({
    to,
    subject: `${isSubscription ? "💜 New subscription" : "💰 New purchase"} — ${item.name} · ${money(amountPence, currency)}`,
    text: `New ${isSubscription ? "subscription" : "one-off purchase"}.

Customer: ${customerName || "(no name)"} <${customerEmail}>
Item:     ${item.name}
Type:     ${isSubscription ? "Recurring monthly" : "One-time"}
Amount:   ${money(amountPence, currency)}
Ref:      ${ref}

Action: Reply to ${customerEmail} to get started.`,
    html: wrap(`
      <div style="display:inline-block;background:${badgeColor}15;color:${badgeColor};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 12px;border-radius:3px;margin-bottom:20px;">
        ${badge}
      </div>

      <h1 style="font-family:Impact,'Arial Narrow',sans-serif;font-size:34px;line-height:1.05;margin:0 0 8px;letter-spacing:0.5px;">
        ${isSubscription ? "New subscription" : "New purchase"}
      </h1>
      <p style="font-size:15px;color:#666;margin:0 0 28px;">
        Someone just paid you. Details below.
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:15px;margin:0 0 24px;">
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee;color:#888;width:120px;vertical-align:top;">Customer</td>
          <td style="padding:14px 0;border-bottom:1px solid #eee;">
            <div style="font-weight:700;color:#111;">${customerName || "No name provided"}</div>
            <a href="mailto:${customerEmail}" style="color:#2563eb;text-decoration:none;font-size:14px;">${customerEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee;color:#888;vertical-align:top;">Item</td>
          <td style="padding:14px 0;border-bottom:1px solid #eee;color:#111;font-weight:600;">${item.name}</td>
        </tr>
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee;color:#888;vertical-align:top;">Type</td>
          <td style="padding:14px 0;border-bottom:1px solid #eee;color:#111;">
            ${isSubscription ? "Recurring · Billed monthly" : "One-time payment"}
          </td>
        </tr>
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee;color:#888;vertical-align:top;">Amount</td>
          <td style="padding:14px 0;border-bottom:1px solid #eee;color:#111;font-weight:700;font-size:18px;">${money(amountPence, currency)}</td>
        </tr>
        <tr>
          <td style="padding:14px 0;color:#888;vertical-align:top;">Ref</td>
          <td style="padding:14px 0;font-family:'SF Mono',Menlo,monospace;font-size:12px;color:#666;word-break:break-all;">${ref}</td>
        </tr>
      </table>

      ${isSubscription
        ? infoBox(
            "What to do next",
            `<p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 10px;">
              This is a <strong>recurring subscription</strong>. You'll be charged automatically every month until they cancel.
            </p>
            <ol style="font-size:15px;color:#333;line-height:1.7;margin:0;padding-left:20px;">
              <li>Reply to the customer to say hi and confirm.</li>
              <li>Send them their first month's content (or book their first call).</li>
              <li>They're already on the automated welcome email list.</li>
            </ol>`,
            "#7c3aed",
            "#f5f3ff"
          )
        : item.deliveryType === "digital"
          ? infoBox(
              "What to do next",
              `<p style="font-size:15px;color:#333;line-height:1.6;margin:0;">
                <strong>Digital delivery.</strong> The customer has automatically received an email with the Google Drive link. Nothing to do — just be ready to answer any questions.
              </p>`,
              "#2563eb"
            )
          : infoBox(
              "What to do next",
              `<p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 10px;">
                <strong>Waiting for footage.</strong> The customer has been emailed to send their match footage via WhatsApp. Nothing to do until it arrives.
              </p>
              <p style="font-size:15px;color:#333;line-height:1.6;margin:0;">
                When you receive it, watch the match and reply with your analysis video.
              </p>`,
              "#2563eb"
            )}

      <p style="font-size:15px;color:#333;line-height:1.6;margin:24px 0 0;">
        That's it. Everything else is automatic.
      </p>
      <p style="font-size:14px;color:#888;line-height:1.6;margin:16px 0 0;">
        Open Stripe Dashboard to see all payments, refunds and cancellations.
      </p>
    `),
  });
}