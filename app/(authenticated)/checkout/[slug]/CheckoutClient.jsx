"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock, CreditCard, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice, lessonCount } from "@/lib/data";
import { apiGet, apiPost } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";

async function fetchPurchases() {
  const { purchases } = await apiGet("/api/purchases");
  return purchases;
}

const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExp = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

export default function CheckoutClient({ programme: p }) {
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: purchases } = useQuery({ queryKey: ["purchases"], queryFn: fetchPurchases });
  const owned = purchases?.some((x) => x.programme_slug === p.slug);

  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/29");
  const [cvc, setCvc] = useState("123");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const pay = async (e) => {
    e.preventDefault();
    if (card.replace(/\s/g, "").length < 16) return toast.error("Enter a full card number");
    if (!/^\d{2}\/\d{2}$/.test(exp)) return toast.error("Enter expiry as MM/YY");
    if (cvc.length < 3) return toast.error("Enter your CVC");
    if (!name.trim()) return toast.error("Enter the name on the card");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1400));
    try {
      const { ref } = await apiPost("/api/purchases", { programme_slug: p.slug });
      await qc.invalidateQueries({ queryKey: ["purchases"] });
      router.push(`/checkout/success?programme=${p.slug}&ref=${ref}`);
    } catch (err) {
      toast.error(err.code === "DUPLICATE" ? "You already own this programme." : "Payment failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (owned) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-5xl">You already own {p.name}</h1>
        <Button asChild className="mt-6 font-bold uppercase"><Link href={`/learn/${p.slug}`}>Continue training</Link></Button>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_400px]">
      <section>
        <Link href={`/programmes/${p.slug}`} className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">← Back</Link>
        <h1 className="mt-4 text-6xl">Checkout</h1>
        <ol className="mt-6 flex gap-6 text-xs font-bold uppercase tracking-widest">
          <li className="flex items-center gap-2 text-primary"><Check className="h-4 w-4" />Account</li>
          <li className="text-foreground">2 · Payment</li>
          <li className="text-muted-foreground">3 · Access</li>
        </ol>
        <div className="mt-6 flex gap-3 border border-primary/40 bg-primary/10 p-4 text-sm"><Info className="h-5 w-5 shrink-0 text-primary" />Demo mode — no real money is taken. Use any card details to complete your purchase.</div>
        <form onSubmit={pay} className="mt-8 grid gap-5 border bg-card p-6">
          <div className="grid gap-2"><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
          <div className="grid gap-2">
            <Label htmlFor="card">Card number</Label>
            <div className="relative">
              <Input id="card" inputMode="numeric" value={card} onChange={(e) => setCard(fmtCard(e.target.value))} className="pl-10" />
              <CreditCard className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label htmlFor="exp">Expiry</Label><Input id="exp" placeholder="MM/YY" value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} /></div>
            <div className="grid gap-2"><Label htmlFor="cvc">CVC</Label><Input id="cvc" inputMode="numeric" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} /></div>
          </div>
          <div className="grid gap-2"><Label htmlFor="name">Name on card</Label><Input id="name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} /></div>
          <Button type="submit" size="lg" disabled={busy} className="h-12 text-base font-bold uppercase tracking-wider">
            <Lock />{busy ? "Processing payment…" : `Pay ${formatPrice(p.pricePence)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Secure checkout · 14-day money-back guarantee</p>
        </form>
      </section>
      <aside className="lg:pt-24">
        <div className="border bg-card p-6">
          <h2 className="text-2xl text-muted-foreground">Order summary</h2>
          <div className="mt-4 flex justify-between gap-4">
            <div>
              <div className="font-display text-3xl">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.weeks} weeks · {lessonCount(p)} lessons</div>
            </div>
            <div className="font-display text-3xl">{formatPrice(p.pricePence)}</div>
          </div>
          <div className="mt-6 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(p.pricePence)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>VAT (incl.)</span><span>£{(p.pricePence / 600).toFixed(2)}</span></div>
            <div className="flex justify-between pt-2 text-lg font-bold"><span>Total</span><span>{formatPrice(p.pricePence)}</span></div>
          </div>
        </div>
      </aside>
    </main>
  );
}