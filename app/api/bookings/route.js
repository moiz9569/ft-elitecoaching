import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const me = await requireUser();
  const { bookings } = await collections();
  const rows = await bookings
    .find({ userId: new ObjectId(me.id) })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    bookings: rows.map((b) => ({
      id: String(b._id),
      serviceSlug: b.serviceSlug,
      serviceName: b.serviceName,
      amountPence: b.amountPence,
      status: b.status,
      bookingDate: b.bookingDate || null,
      bookingTime: b.bookingTime || null,
      playerNotes: b.playerNotes || "",
      createdAt: b.createdAt,
    })),
  });
}
