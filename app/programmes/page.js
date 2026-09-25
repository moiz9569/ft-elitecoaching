import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/SiteHeader";
import { programmes, formatPrice, lessonCount } from "@/lib/data";

export const metadata = {
  title: "Training programmes — FT Elite Coaching",
  description: "Structured digital football training programmes. Buy once, train anywhere.",
  openGraph: { title: "Training programmes — FT Elite Coaching", description: "Structured digital football training programmes." },
};

export default function ProgrammesPage() {
  return (
    <main>
      <PageHero eyebrow="Digital programmes" title="Train anywhere. Improve everywhere.">
        Video-led programmes you unlock once and keep forever. Follow them from your member dashboard.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
        {programmes.map((p) => (
          <div key={p.slug} className="flex flex-col border bg-card p-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground"><span>{p.weeks} weeks · {lessonCount(p)} lessons</span></div>
            <h2 className="mt-6 text-5xl">{p.name}</h2>
            <p className="mt-2 text-muted-foreground">{p.tagline}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {p.outcomes.map((o) => <li key={o} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{o}</li>)}
            </ul>
            <div className="mt-8 border-t pt-6">
              <div className="font-display text-5xl">{formatPrice(p.pricePence)}</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href={`/programmes/${p.slug}`} className="border py-3 text-center text-sm font-bold uppercase tracking-wider hover:border-primary">Details</Link>
                <Link href={`/checkout/${p.slug}`} className="bg-primary py-3 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">Buy now</Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}