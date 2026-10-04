import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Infinity as InfinityIcon, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProgramme, programmes, formatPrice } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProgramme(slug);
  if (!p) return { title: "Not found", robots: { index: false } };
  return {
    title: `${p.name} — FT Elite Coaching`,
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
          <Link
            href="/programmes"
            className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            ← All packages
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Monthly · {p.level}
          </p>
          <h1 className="mt-3 text-6xl md:text-8xl">{p.name}</h1>
          <p className="mt-4 text-xl text-muted-foreground">{p.tagline}</p>

          <img
            src="/programme.jpg"
            alt=""
            loading="lazy"
            width={1280}
            height={960}
            className="mt-10 aspect-video w-full border object-cover"
          />

          <p className="mt-10 text-lg">{p.description}</p>

          <h2 className="mt-12 text-4xl">What you get</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {p.outcomes.map((o) => (
              <li key={o} className="flex gap-3 border bg-card p-4">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                {o}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-4xl">Every month includes</h2>
          <ul className="mt-4 space-y-3 text-lg">
            {p.includes.map((i) => (
              <li key={i} className="flex gap-3">
                <Sparkles className="h-5 w-5 shrink-0 text-primary" />
                {i}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border bg-card p-8">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-7xl">
                {formatPrice(p.pricePence, p.currency)}
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                / month
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Billed monthly · cancel any time
            </p>

            <Button
              asChild
              size="lg"
              className="mt-6 h-12 w-full text-base font-bold uppercase tracking-wider"
            >
              <Link href={`/checkout/${p.slug}`}>Subscribe now</Link>
            </Button>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <InfinityIcon className="h-4 w-4 text-primary" />
                Ongoing access while subscribed
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Cancel any time, no minimum
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}