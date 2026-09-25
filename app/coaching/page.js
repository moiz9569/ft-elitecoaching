import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/SiteHeader";
import { services } from "@/lib/data";

export const metadata = {
  title: "Coaching sessions — FT Elite Coaching",
  description: "1-to-1, small group and match analysis football coaching. Book online.",
  openGraph: { title: "Coaching sessions — FT Elite Coaching", description: "1-to-1, small group and match analysis football coaching." },
};

export default function CoachingPage() {
  return (
    <main>
      <PageHero eyebrow="Coaching" title="Sessions built around you">
        Choose the session type that fits your goals, pick a time and turn up ready to work.
      </PageHero>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-16 sm:px-6">
        {services.map((s, i) => (
          <Link key={s.slug} href={`/coaching/${s.slug}`} className="group grid items-center gap-6 border bg-card p-8 transition-colors hover:border-primary md:grid-cols-[80px_1fr_auto]">
            <span className="font-display text-5xl text-muted-foreground group-hover:text-primary">0{i + 1}</span>
            <div>
              <h2 className="text-4xl md:text-5xl">{s.name}</h2>
              <p className="mt-2 text-muted-foreground">{s.tagline}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{s.duration}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-display text-5xl">{s.price}</span>
              <ArrowRight className="h-8 w-8 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}