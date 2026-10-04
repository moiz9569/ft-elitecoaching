"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/data";
import { apiPost } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";

export default function CheckoutClient({ item, kind }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const isSub = kind === "subscription";

  const pay = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { url } = await apiPost("/api/checkout", { slug: item.slug });
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

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_400px]">
      <section>
        <Link
          href={isSub ? `/programmes/${item.slug}` : `/coaching/${item.slug}`}
          className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary"
        >
          ← Back
        </Link>
        <h1 className="mt-4 text-6xl">Checkout</h1>

        <ol className="mt-6 flex gap-6 text-xs font-bold uppercase tracking-widest">
          <li className="flex items-center gap-2 text-primary">
            <Check className="h-4 w-4" />
            Account
          </li>
          <li className="text-foreground">2 · Payment</li>
          <li className="text-muted-foreground">3 · Access</li>
        </ol>

        <div className="mt-6 flex gap-3 border border-primary/40 bg-primary/10 p-4 text-sm">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          You&apos;ll be redirected to Stripe&apos;s secure payment page.
        </div>

        <form onSubmit={pay} className="mt-8 grid gap-5 border bg-card p-6">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>

          <div className="grid gap-2">
            <Label>Payment</Label>
            <div className="flex items-center gap-3 border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" />
              Secured by Stripe · card details entered on the next screen
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="h-12 text-base font-bold uppercase tracking-wider"
          >
            <Lock />
            {busy
              ? "Redirecting to Stripe…"
              : isSub
                ? `Subscribe ${formatPrice(item.pricePence, item.currency)} / month`
                : `Pay ${formatPrice(item.pricePence, item.currency)}`}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {isSub
              ? "Billed monthly by Stripe · cancel any time from your dashboard"
              : "Secure checkout powered by Stripe"}
          </p>
        </form>
      </section>

      <aside className="lg:pt-24">
        <div className="border bg-card p-6">
          <h2 className="text-2xl text-muted-foreground">Order summary</h2>

          <div className="mt-4 flex justify-between gap-4">
            <div>
              <div className="font-display text-3xl">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.tagline}</div>
            </div>
            <div className="font-display text-3xl text-right">
              {formatPrice(item.pricePence, item.currency)}
            </div>
          </div>

          <div className="mt-6 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{isSub ? "Monthly" : "Subtotal"}</span>
              <span>{formatPrice(item.pricePence, item.currency)}</span>
            </div>
            {isSub && (
              <div className="flex justify-between text-muted-foreground">
                <span>Billing</span>
                <span>Every month</span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-lg font-bold">
              <span>{isSub ? "Per month" : "Total"}</span>
              <span>{formatPrice(item.pricePence, item.currency)}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}