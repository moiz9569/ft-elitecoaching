import Link from "next/link";
import { PageHero } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About the coach — FT Elite Coaching",
  description: "Meet the coach behind FT Elite Coaching and the philosophy that drives every session.",
  openGraph: { title: "About — FT Elite Coaching", description: "Meet the coach behind FT Elite Coaching." },
};

export default function About() {
  return (
    <main>
      <PageHero eyebrow="About" title="Built on the training ground">
        FT Elite Coaching exists to give ambitious players the kind of detailed, personal coaching usually reserved for academies.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
        <img src="/coaching.jpg" alt="The coach working with a player" loading="lazy" width={1280} height={960} className="aspect-[4/3] w-full border object-cover" />
        <div className="space-y-5 text-lg">
          <h2 className="text-5xl">The coach</h2>
          <p className="text-muted-foreground">With years of experience coaching grassroots and academy players, the coach combines modern methods with honest, direct feedback. Every session has a purpose, and every player leaves knowing exactly what to work on next.</p>
          <p className="text-muted-foreground">Qualified, DBS-checked and fully insured.</p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[["Detail", "Every touch matters"], ["Honesty", "Real feedback"], ["Intensity", "Match-realistic"]].map(([t, d]) => (
              <div key={t} className="border-t-2 border-primary pt-3">
                <div className="font-display text-2xl">{t}</div>
                <div className="text-sm text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-4 font-bold uppercase"><Link href="/coaching">Train with the coach</Link></Button>
        </div>
      </section>
    </main>
  );
}