"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Video,
  History,
  CalendarCheck,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { formatPrice, getService } from "@/lib/data";
import { apiGet } from "@/lib/api-client";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiGet("/api/bookings")
      .then(({ bookings }) => {
        if (!cancelled) setBookings(bookings ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load your bookings");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(
    (b) => b.bookingDate && b.bookingDate >= today,
  );
  const past = bookings.filter((b) => !b.bookingDate || b.bookingDate < today);

  return (
    <PortalShell>
      <div className="px-6 py-10 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Coaching
        </p>
        <h1 className="mt-3 text-6xl md:text-7xl">My bookings</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Your upcoming and past coaching sessions, all in one place.
        </p>

        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading…</p>
        ) : bookings.length === 0 ? (
          <div className="mt-10 border bg-card p-12 text-center">
            <CalendarCheck className="mx-auto h-12 w-12 text-primary" />
            <h3 className="mt-4 text-4xl">No sessions booked yet</h3>
            <p className="mt-2 text-muted-foreground">
              Book a 1-to-1, small group or match analysis session with the
              coach.
            </p>
            <Button asChild size="lg" className="mt-6 font-bold uppercase">
              <Link href="/coaching">Book a session</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <>
                <h2 className="mt-10 flex items-center gap-3 text-3xl">
                  <CalendarDays className="h-6 w-6 text-primary" />
                  Upcoming
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-bold text-primary">
                    {upcoming.length}
                  </span>
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {upcoming.map((b) => (
                    <BookingCard key={b.id} booking={b} state="upcoming" />
                  ))}
                </div>
              </>
            )}

            {/* Past */}
            {past.length > 0 && (
              <>
                <h2 className="mt-12 flex items-center gap-3 text-3xl text-muted-foreground">
                  <History className="h-6 w-6" />
                  Past sessions
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold">
                    {past.length}
                  </span>
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {past.map((b) => (
                    <BookingCard key={b.id} booking={b} state="past" />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </PortalShell>
  );
}

function BookingCard({ booking, state }) {
  const service = getService(booking.serviceSlug);
  const meetLink = service?.meetLink;
  const isUpcoming = state === "upcoming";

  const formatDate = (d) => {
    if (!d) return "Date not set";
    try {
      const dt = new Date(d + "T00:00:00");
      return dt.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  const formatTime = (t) => {
    if (!t) return "";
    try {
      const [h, m] = t.split(":");
      const hour = parseInt(h, 10);
      const suffix = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour}:${m} ${suffix}`;
    } catch {
      return t;
    }
  };

  return (
    <div className="border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <span
              className={isUpcoming ? "text-primary" : "text-muted-foreground"}
            >
              {isUpcoming ? "Upcoming" : "Completed"}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {formatPrice(booking.amountPence)}
            </span>
          </div>
          <h3 className="mt-2 text-3xl">{booking.serviceName}</h3>
        </div>
        {isUpcoming && (
          <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Confirmed
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-semibold text-foreground">
            {formatDate(booking.bookingDate)}
          </span>
        </div>
        {booking.bookingTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-semibold text-foreground">
              {formatTime(booking.bookingTime)}
            </span>
          </div>
        )}
        {service?.duration && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{service.duration}</span>
          </div>
        )}
      </div>

      {booking.playerNotes && (
        <div className="mt-4 border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground">
          <strong className="text-foreground">Your notes:</strong>{" "}
          {booking.playerNotes}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
        {isUpcoming && meetLink && (
          <Button asChild className="font-bold uppercase">
            <a href={meetLink} target="_blank" rel="noopener noreferrer">
              <Video />
              Join Meet
            </a>
          </Button>
        )}
        {isUpcoming && (
          <Button asChild variant="outline" className="font-bold uppercase">
            <Link href={`/coaching/${booking.serviceSlug}`}>
              Session details
            </Link>
          </Button>
        )}
        {!isUpcoming && (
          <Button asChild variant="outline" className="font-bold uppercase">
            <Link href={`/coaching/${booking.serviceSlug}`}>Book again</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
