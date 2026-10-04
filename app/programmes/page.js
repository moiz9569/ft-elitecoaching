import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/SiteHeader";
import { programmes, formatPrice } from "@/lib/data";

export const metadata = {
  title: "Monthly packages — FT Elite Coaching",
  description: "Ongoing technical development and mentorship. Cancel any time.",
  openGraph: {
    title: "Monthly packages — FT Elite Coaching",
    description: "Ongoing technical development and mentorship.",
  },
};

export default function ProgrammesPage() {
  return (
    <main>
      <PageHero eyebrow="Monthly packages" title="Train every month. Improve every month.">
        Ongoing coaching and mentorship. Billed monthly, cancel any time.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
        {programmes.map((p) => (
          <div key={p.slug} className="flex flex-col border bg-card p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {p.level}
            </div>
            <h2 className="mt-4 text-5xl">{p.name}</h2>
            <p className="mt-3 text-muted-foreground">{p.tagline}</p>

            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {p.outcomes.map((o) => (
                <li key={o} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {o}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t pt-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-6xl">
                  {formatPrice(p.pricePence, p.currency)}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  / month
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/programmes/${p.slug}`}
                  className="border py-3 text-center text-sm font-bold uppercase tracking-wider hover:border-primary"
                >
                  Details
                </Link>
                <Link
                  href={`/checkout/${p.slug}`}
                  className="bg-primary py-3 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  Subscribe
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}