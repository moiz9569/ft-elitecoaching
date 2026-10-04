"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, ExternalLink, Mail } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { formatPrice, getService } from "@/lib/data";
import { apiGet } from "@/lib/api-client";

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiGet("/api/purchases")
      .then(({ purchases }) => {
        if (!cancelled) setPurchases(purchases ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load your purchases");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PortalShell>
      <div className="px-6 py-10 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          One-off services
        </p>
        <h1 className="mt-3 text-6xl md:text-7xl">My purchases</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Ball Mastery, Match Analysis and other one-off services you&apos;ve bought.
        </p>

        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading…</p>
        ) : purchases.length === 0 ? (
          <div className="mt-10 border bg-card p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-primary" />
            <h3 className="mt-4 text-4xl">No purchases yet</h3>
            <p className="mt-2 text-muted-foreground">
              Grab a one-off service — a digital product or a match analysis.
            </p>
            <Button asChild size="lg" className="mt-6 font-bold uppercase">
              <Link href="/coaching">Browse services</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {purchases.map((p) => {
              const item = getService(p.itemSlug);
              const isDigital = p.deliveryType === "digital";

              return (
                <div key={p.id} className="border bg-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {formatPrice(p.amountPence, p.currency)} ·{" "}
                        {new Date(p.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <h3 className="mt-2 text-3xl">{p.itemName}</h3>
                      {item?.tagline && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.tagline}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                      Paid
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
                    {isDigital && item?.driveLink && (
                      <Button asChild className="font-bold uppercase">
                        <a
                          href={item.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink />
                          Open library
                        </a>
                      </Button>
                    )}
                    {!isDigital && item?.whatsapp && (
                      <Button asChild className="font-bold uppercase">
                        <a
                          href={item.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink />
                          Send footage
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="font-bold uppercase">
                      <Link href={`/coaching/${p.itemSlug}`}>Service details</Link>
                    </Button>
                  </div>

                  {!isDigital && (
                    <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>
                        Send footage via WhatsApp and the coach will reply with your
                        analysis video.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-14 flex items-center gap-3 border bg-card p-6 text-sm text-muted-foreground">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Looking for something new?{" "}
          <Link href="/coaching" className="font-bold text-primary hover:underline">
            Browse one-off services
          </Link>
        </div>
      </div>
    </PortalShell>
  );
}