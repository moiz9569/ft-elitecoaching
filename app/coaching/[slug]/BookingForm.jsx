"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";

export default function BookingForm({ service }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const minDate = new Date().toISOString().split("T")[0];

  const pay = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push(`/auth?redirect=/coaching/${service.slug}`);
      return;
    }
    if (!date) return toast.error("Pick a date");
    if (!time) return toast.error("Pick a time");
    if (notes.length > 500)
      return toast.error("Notes must be 500 characters or less");

    setBusy(true);
    try {
      const res = await apiPost("/api/checkout", {
        type: "coaching",
        service_slug: service.slug,
        booking_date: date,
        booking_time: time,
        player_notes: notes,
      });
      console.log("[BookingForm] checkout response:", res);
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error("Could not start checkout.");
        setBusy(false);
      }
    } catch (err) {
      toast.error(err.message || "Payment failed. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="border bg-card p-8">
      <div className="flex items-end justify-between">
        <span className="font-display text-6xl">{service.price}</span>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {service.duration}
        </span>
      </div>

      <form onSubmit={pay} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="date">Preferred date</Label>
          <Input
            id="date"
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="time">Preferred time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes for the coach (optional)</Label>
          <Textarea
            id="notes"
            rows={3}
            maxLength={500}
            placeholder="Position, goals, anything the coach should know…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-start gap-2 border bg-muted/40 p-3 text-xs text-muted-foreground">
          <Video className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <span>
            You&apos;ll get a Google Meet link by email as soon as your payment
            goes through.
          </span>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={busy || loading}
          className="h-12 w-full text-base font-bold uppercase tracking-wider"
        >
          <Lock />
          {busy ? "Redirecting to payment…" : `Pay ${service.price} & book`}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Secure checkout powered by Stripe
        </p>
      </form>
    </div>
  );
}
