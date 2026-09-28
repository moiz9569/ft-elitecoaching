import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/SiteHeader";
import { programmes, formatPrice, lessonCount } from "@/lib/data";

export const metadata = {
  title: "Training programmes — FT Elite Coaching",
  description: "Structured digital football training programmes. Buy once, train anywhere.",
  openGraph: { title: "Training programmes — FT Elite Coaching", description: "Structured digital football training programmes." },
};

// Map each programme slug to a background image
// Slugs MUST match @/lib/data programmes slugs
const programmeImages = {
  "speed-agility": "/Copy of IMG_8317.JPG",
  "ball-mastery": "/Copy of IMG_8287.JPG",
  "elite-finisher": "/Copy of IMG_8322.JPG",
};

export default function ProgrammesPage() {
  return (
    <main>
      <PageHero eyebrow="Digital programmes" title="Train anywhere. Improve everywhere.">
        Video-led programmes you unlock once and keep forever. Follow them from your member dashboard.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
        {programmes.map((p) => (
          <div
            key={p.slug}
            className="group relative isolate flex flex-col overflow-hidden border bg-card p-6"
          >
            {/* Background image */}
            <Image
              src={programmeImages[p.slug] || "/coaching.jpg"}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#00001A]/85 via-[#00001A]/35 to-[#00001A]/15" />

            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/70">
              <span>{p.weeks} weeks · {lessonCount(p)} lessons</span>
            </div>
            <h2 className="mt-6 text-5xl text-white">{p.name}</h2>
            <p className="mt-2 text-white/70">{p.tagline}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-white/90">
              {p.outcomes.map((o) => (
                <li key={o} className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {o}
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-white/20 pt-6">
              <div className="font-display text-5xl text-white">{formatPrice(p.pricePence)}</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/programmes/${p.slug}`}
                  className="border border-white/30 py-3 text-center text-sm font-bold uppercase tracking-wider text-white hover:border-primary"
                >
                  Details
                </Link>
                <Link
                  href={`/checkout/${p.slug}`}
                  className="bg-primary py-3 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  Buy now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}