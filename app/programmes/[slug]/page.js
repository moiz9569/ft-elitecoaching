import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, PlayCircle, Infinity as InfinityIcon, Smartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getProgramme, formatPrice, lessonCount, programmes } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProgramme(slug);
  if (!p) return { title: "Not found", robots: { index: false } };
  return {
    title: `${p.name} programme — FT Elite Coaching`,
    description: p.description,
    openGraph: { title: `${p.name} — FT Elite Coaching`, description: p.description },
  };
}

export function generateStaticParams() {
  return programmes.map((p) => ({ slug: p.slug }));
}

export default async function ProgrammeDetail({ params }) {
  const { slug } = await params;
  const p = getProgramme(slug);
  if (!p) notFound();

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-24">
        <div>
          <Link href="/programmes" className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">← All programmes</Link>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">{p.weeks} weeks · {lessonCount(p)} lessons · {p.level}</p>
          <h1 className="mt-3 text-7xl md:text-9xl">{p.name}</h1>
          <p className="mt-4 text-xl text-muted-foreground">{p.tagline}</p>
          <img src="/programme.jpg" alt="" loading="lazy" width={1280} height={960} className="mt-10 aspect-video w-full border object-cover" />
          <p className="mt-10 text-lg">{p.description}</p>
          <h2 className="mt-12 text-4xl">What you&apos;ll achieve</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {p.outcomes.map((o) => <li key={o} className="flex gap-3 border bg-card p-4"><Check className="h-5 w-5 shrink-0 text-primary" />{o}</li>)}
          </ul>
          <h2 className="mt-12 text-4xl">Curriculum</h2>
          <Accordion type="single" collapsible defaultValue="w0" className="mt-4 border">
            {p.curriculum.map((w, i) => (
              <AccordionItem key={w.title} value={`w${i}`} className="px-4">
                <AccordionTrigger className="font-display text-2xl hover:no-underline">
                  {w.title}
                  <span className="ml-auto mr-4 font-sans text-sm text-muted-foreground">{w.lessons.length} lessons</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {w.lessons.map((l) => (
                      <li key={l.id} className="flex items-center justify-between text-muted-foreground">
                        <span className="flex items-center gap-2"><PlayCircle className="h-4 w-4" />{l.title}</span>
                        <span className="text-xs">{l.duration}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border bg-card p-8">
            <div className="font-display text-7xl">{formatPrice(p.pricePence)}</div>
            <p className="text-sm text-muted-foreground">One-off payment · lifetime access</p>
            <Button asChild size="lg" className="mt-6 h-12 w-full text-base font-bold uppercase tracking-wider">
              <Link href={`/checkout/${p.slug}`}>Buy now</Link>
            </Button>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><InfinityIcon className="h-4 w-4 text-primary" />Lifetime access &amp; updates</li>
              <li className="flex gap-2"><Smartphone className="h-4 w-4 text-primary" />Train on phone, tablet or laptop</li>
              <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-primary" />14-day money-back guarantee</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}