import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProgramme, getService } from "@/lib/data";
import { requireUser } from "@/lib/auth";

export async function GET(req) {
  const me = await requireUser();
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "Missing session_id" },
      { status: 400 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const meta = session.metadata || {};

    if (meta.userId !== me.id) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { ok: false, error: "Not paid" },
        { status: 400 },
      );
    }

    if (meta.type === "programme") {
      const programme = getProgramme(meta.programmeSlug);
      return NextResponse.json({
        ok: true,
        type: "programme",
        programmeSlug: programme?.slug,
        programmeName: programme?.name,
        ref: session.payment_intent || session.id,
      });
    }

    if (meta.type === "coaching") {
      const service = getService(meta.serviceSlug);
      return NextResponse.json({
        ok: true,
        type: "coaching",
        serviceName: service?.name,
        serviceSlug: service?.slug,
        bookingDate: meta.bookingDate || "",
        bookingTime: meta.bookingTime || "",
        customerName: session.customer_details?.name || "",
        customerEmail: session.customer_details?.email || "",
        ref: session.payment_intent || session.id,
      });
    }

    return NextResponse.json(
      { ok: false, error: "Unknown type" },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid session" },
      { status: 400 },
    );
  }
}
