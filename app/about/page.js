import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About the coach — FT Elite Coaching",
  description: "Meet the coach behind FT Elite Coaching and the philosophy that drives every session.",
  openGraph: { title: "About — FT Elite Coaching", description: "Meet the coach behind FT Elite Coaching." },
};

export default function About() {
  return (
    <main>
      {/* Custom hero with background image */}
      <section className="relative isolate overflow-hidden border-b">
        <Image
          src="/IMG_8035.JPG"
          alt=""
          fill
          sizes="100vw"
          priority
          className="-z-20 object-cover"
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#00001A]/85 via-[#00001A]/55 to-[#00001A]/15" />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
            About
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-8xl">
            Built on the training ground
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            FT Elite Coaching exists to give ambitious players the kind of detailed, personal coaching usually reserved for academies.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
        <img
          src="/Copy of IMG_8173.JPG"
          alt="The coach working with a player"
          loading="lazy"
          width={1280}
          height={960}
          className="aspect-[4/3] w-full border object-cover"
        />
        <div className="space-y-5 text-lg">
          <h2 className="text-5xl">The coach</h2>
          <p className="text-muted-foreground">
            With years of experience coaching grassroots and academy players, the coach combines modern methods with honest, direct feedback. Every session has a purpose, and every player leaves knowing exactly what to work on next.
          </p>
          <p className="text-muted-foreground">Qualified, DBS-checked and fully insured.</p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[["Detail", "Every touch matters"], ["Honesty", "Real feedback"], ["Intensity", "Match-realistic"]].map(([t, d]) => (
              <div key={t} className="border-t-2 border-primary pt-3">
                <div className="font-display text-2xl">{t}</div>
                <div className="text-sm text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-4 font-bold uppercase">
            <Link href="/coaching">Train with the coach</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}