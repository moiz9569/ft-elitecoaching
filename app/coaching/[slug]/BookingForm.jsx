"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";
import { formatPrice } from "@/lib/data";

export default function BookingForm({ service }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const pay = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push(`/auth?redirect=/coaching/${service.slug}`);
      return;
    }

    setBusy(true);
    try {
      const { url } = await apiPost("/api/checkout", { slug: service.slug });
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not start checkout.");
        setBusy(false);
      }
    } catch (err) {
      toast.error(err.message || "Payment failed. Please try again.");
      setBusy(false);
    }
  };

  const isDigital = service.deliveryType === "digital";

  return (
    <div className="border bg-card p-8">
      <div className="flex items-end justify-between">
        <span className="font-display text-6xl">
          {formatPrice(service.pricePence, service.currency)}
        </span>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {service.duration}
        </span>
      </div>

      <form onSubmit={pay} className="mt-6 grid gap-4">
        <div className="flex items-start gap-2 border bg-muted/40 p-3 text-xs text-muted-foreground">
          {isDigital ? (
            <>
              <Send className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>
                Instant access — the link is sent to <strong className="text-foreground">{user?.email || "your email"}</strong> as soon as payment goes through.
              </span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>
                After payment, you&apos;ll get instructions by email on how to send your footage.
              </span>
            </>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={busy || loading}
          className="h-12 w-full text-base font-bold uppercase tracking-wider"
        >
          <Lock />
          {busy
            ? "Redirecting to payment…"
            : `Pay ${formatPrice(service.pricePence, service.currency)}`}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Secure checkout powered by Stripe
        </p>
      </form>
    </div>
  );
}