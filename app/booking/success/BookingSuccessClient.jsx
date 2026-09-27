"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, CalendarDays, Video, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingSuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("loading");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    fetch(`/api/checkout/verify?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.type === "coaching") {
          setDetails(d);
          setStatus("ok");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "loading") {
    return (
      <main className="pitch-lines flex min-h-[75vh] items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Confirming your booking…</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="pitch-lines flex min-h-[75vh] items-center justify-center px-4">
        <div className="max-w-lg border bg-card p-10 text-center">
          <h1 className="text-5xl">Something went wrong</h1>
          <p className="mt-3 text-muted-foreground">
            We couldn&apos;t confirm your booking. If money left your account,
            contact us and we&apos;ll sort it.
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-6 font-bold uppercase"
          >
            <Link href="/coaching">Back to sessions</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pitch-lines flex min-h-[75vh] items-center justify-center px-4">
      <div className="max-w-lg border bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 text-6xl">Booking confirmed.</h1>
        <p className="mt-3 text-muted-foreground">
          Your{" "}
          <strong className="text-foreground">{details?.serviceName}</strong>{" "}
          session is locked in.
        </p>

        {details?.bookingDate && (
          <p className="mt-6 flex items-center justify-center gap-2 text-lg text-foreground">
            <CalendarDays className="h-5 w-5 text-primary" />
            <strong>
              {details.bookingDate}
              {details.bookingTime && ` at ${details.bookingTime}`}
            </strong>
          </p>
        )}

        <div className="mt-8 space-y-3 border-t pt-6 text-left text-sm text-muted-foreground">
          <div className="flex gap-3">
            <Mail className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>
              A confirmation with your{" "}
              <strong className="text-foreground">Google Meet link</strong> has
              been sent to{" "}
              <strong className="text-foreground">
                {details?.customerEmail}
              </strong>
              .
            </span>
          </div>
          <div className="flex gap-3">
            <Video className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>
              Check your inbox — if you don&apos;t see it in 5 minutes, check
              spam or contact the coach.
            </span>
          </div>
        </div>

        {details?.ref && (
          <p className="mt-6 text-xs text-muted-foreground">
            Order ref: {details.ref}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="font-bold uppercase">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="font-bold uppercase"
          >
            <Link href="/coaching">Book another session</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
