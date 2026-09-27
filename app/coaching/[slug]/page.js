import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL, getService } from "@/lib/data";
import BookingForm from "./BookingForm";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: "Not found", robots: { index: false } };
  return {
    title: `${s.name} — FT Elite Coaching`,
    description: s.description,
    openGraph: {
      title: `${s.name} — FT Elite Coaching`,
      description: s.description,
    },
  };
}

export function generateStaticParams() {
  return [
    { slug: "one-to-one" },
    { slug: "small-group" },
    { slug: "match-analysis" },
  ];
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <Link
            href="/coaching"
            className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            ← All sessions
          </Link>
          <h1 className="mt-6 text-6xl md:text-8xl">{s.name}</h1>
          <p className="mt-4 text-xl text-muted-foreground">{s.tagline}</p>
          <p className="mt-6 text-lg">{s.description}</p>
          <h2 className="mt-10 text-3xl">What&apos;s included</h2>
          <ul className="mt-4 space-y-3">
            {s.includes.map((i) => (
              <li key={i} className="flex gap-3">
                <Check className="h-5 w-5 text-primary" />
                {i}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-3xl">Who it&apos;s for</h2>
          <p className="mt-2 text-muted-foreground">{s.forWho}</p>
        </div>
        <div className="space-y-6">
          <img
            src="/coaching.jpg"
            alt="Coach with player"
            loading="lazy"
            width={1280}
            height={960}
            className="aspect-[4/3] w-full border object-cover"
          />
          <BookingForm service={s} />
          {/* <div className="border bg-card p-8">
            <div className="flex items-end justify-between">
              <span className="font-display text-6xl">{s.price}</span>
              <span className="inline-flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" />{s.duration}</span>
            </div>
            <Button asChild size="lg" className="mt-6 h-12 w-full text-base font-bold uppercase tracking-wider">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer"><CalendarDays /> Book this session</a>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Pick a date and time on the next screen. You&apos;ll get an instant confirmation email.</p>
          </div> */}
        </div>
      </section>
    </main>
  );
}
