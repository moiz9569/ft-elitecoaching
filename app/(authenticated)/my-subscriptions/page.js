"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { formatPrice, getProgramme } from "@/lib/data";
import { apiGet, apiPost } from "@/lib/api-client";

export default function MySubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiGet("/api/subscriptions")
      .then(({ subscriptions }) => {
        if (!cancelled) setSubs(subscriptions ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load your subscriptions");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openPortal = async () => {
    setOpening(true);
    try {
      const { url } = await apiPost("/api/stripe/portal");
      if (url) window.location.href = url;
      else toast.error("Could not open billing portal");
    } catch (err) {
      toast.error(err.message || "Could not open billing portal");
    } finally {
      setOpening(false);
    }
  };

  return (
    <PortalShell>
      <div className="px-6 py-10 md:px-10">
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : subs.length === 0 ? (
          <div className="border bg-card p-12 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-primary" />
            <h3 className="mt-4 text-4xl">No subscriptions yet</h3>
            <p className="mt-2 text-muted-foreground">
              Unlock ongoing training with a monthly package.
            </p>
            <Button asChild size="lg" className="mt-6 font-bold uppercase">
              <Link href="/programmes">Browse packages</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {subs.map((s) => {
                const programme = getProgramme(s.itemSlug);
                const isActive = s.status === "active" || s.status === "trialing";
                const isPastDue = s.status === "past_due";
                const isCanceled = s.status === "canceled";

                return (
                  <div key={s.id} className="border bg-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {formatPrice(s.amountPence, s.currency)} / month
                        </div>
                        <h3 className="mt-2 text-4xl">{s.itemName}</h3>
                        {programme && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {programme.tagline}
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                          isActive
                            ? "bg-primary/15 text-primary"
                            : isPastDue
                              ? "bg-destructive/15 text-destructive"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    {s.currentPeriodEnd && !isCanceled && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                        <span>
                          {isPastDue ? "Payment due" : "Next renewal"}:{" "}
                          <strong className="text-foreground">
                            {new Date(s.currentPeriodEnd).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </strong>
                        </span>
                      </div>
                    )}

                    {isPastDue && (
                      <div className="mt-4 flex items-center gap-2 border border-destructive/40 bg-destructive/10 p-3 text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                        <span>
                          Payment failed — update your card in the billing portal.
                        </span>
                      </div>
                    )}

                    {isCanceled && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                          Cancelled — access until end of current period.
                        </span>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
                      <Button
                        onClick={openPortal}
                        disabled={opening}
                        className="font-bold uppercase"
                      >
                        <ExternalLink />
                        {opening ? "Opening…" : "Manage billing"}
                      </Button>
                      {programme && (
                        <Button
                          asChild
                          variant="outline"
                          className="font-bold uppercase"
                        >
                          <Link href={`/programmes/${programme.slug}`}>
                            Package details
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-3 border bg-card p-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Need to update your card, download invoices or cancel? Use the
                billing portal.
              </span>
              <Button
                onClick={openPortal}
                disabled={opening}
                variant="outline"
                className="font-bold uppercase"
              >
                Open billing portal
              </Button>
            </div>
          </>
        )}
      </div>
    </PortalShell>
  );
}