"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { formatPrice, getService, getProgramme } from "@/lib/data";
import { apiGet } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [subs, setSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([apiGet("/api/purchases"), apiGet("/api/subscriptions")])
      .then(([pRes, sRes]) => {
        if (cancelled) return;
        setPurchases(pRes.purchases ?? []);
        setSubs(sRes.subscriptions ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load your dashboard");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSubs = subs.filter(
    (s) => s.status === "active" || s.status === "trialing"
  );

  return (
    <PortalShell>
      <div className="px-6 py-10 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Member dashboard
        </p>
        <h1 className="mt-3 text-6xl md:text-7xl">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Everything you&apos;ve bought, subscribed to and worked through — in one place.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              One-off purchases
            </div>
            <div className="mt-2 font-display text-6xl text-primary">
              {purchases.length}
            </div>
          </div>
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Active subscriptions
            </div>
            <div className="mt-2 font-display text-6xl text-primary">
              {activeSubs.length}
            </div>
          </div>
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total purchases
            </div>
            <div className="mt-2 font-display text-6xl">
              {purchases.length + subs.length}
            </div>
          </div>
        </div>

        {/* Quick nav cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link
            href="/my-programmes"
            className="group flex flex-col border bg-card p-8 transition-colors hover:border-primary"
          >
            <ShoppingBag className="h-10 w-10 text-primary" />
            <h3 className="mt-6 text-4xl">My purchases</h3>
            <p className="mt-2 text-muted-foreground">
              {purchases.length === 0
                ? "You haven't bought anything yet."
                : `${purchases.length} item${purchases.length === 1 ? "" : "s"} — Ball Mastery, Match Analysis, and more.`}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-primary">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/my-subscriptions"
            className="group flex flex-col border bg-card p-8 transition-colors hover:border-primary"
          >
            <Sparkles className="h-10 w-10 text-primary" />
            <h3 className="mt-6 text-4xl">My subscriptions</h3>
            <p className="mt-2 text-muted-foreground">
              {subs.length === 0
                ? "No active monthly packages."
                : `${activeSubs.length} active subscription${activeSubs.length === 1 ? "" : "s"}.`}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-primary">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Recent purchases */}
        {purchases.length > 0 && (
          <>
            <h2 className="mt-16 text-4xl">Recent purchases</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {purchases.slice(0, 4).map((p) => {
                const item = getService(p.itemSlug) || getProgramme(p.itemSlug);
                return (
                  <div key={p.id} className="border bg-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {formatPrice(p.amountPence, p.currency)}
                        </div>
                        <h3 className="mt-2 text-3xl">
                          {p.itemName || item?.name}
                        </h3>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                        Paid
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
            {purchases.length > 4 && (
              <Button asChild variant="outline" className="mt-6 font-bold uppercase">
                <Link href="/my-programmes">View all purchases</Link>
              </Button>
            )}
          </>
        )}

        {/* CTA strip */}
        <div className="mt-16 flex flex-col gap-4 border bg-card p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="text-2xl">Want more?</h3>
              <p className="text-sm text-muted-foreground">
                Grab a one-off service or start a monthly package.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="font-bold uppercase">
              <Link href="/coaching">One-off services</Link>
            </Button>
            <Button asChild variant="outline" className="font-bold uppercase">
              <Link href="/programmes">Monthly packages</Link>
            </Button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}