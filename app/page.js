import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { programmes, services, formatPrice } from "@/lib/data";
import { TestimonialsSection } from "@/components/site/Testimonials";

export const metadata = {
  title: "FT Elite Coaching — Football coaching & training programmes",
  description:
    "Book 1-to-1 football coaching or train anywhere with FT Elite's digital programmes.",
  openGraph: {
    title: "FT Elite Coaching",
    description:
      "Book 1-to-1 football coaching or train anywhere with digital programmes.",
  },
};

const stats = [
  { n: "500+", l: "Players coached" },
  { n: "40+", l: "Academy trials earned" },
  { n: "4.9★", l: "Average rating" },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative -mt-16 flex min-h-[calc(100svh_+_4rem)] flex-col overflow-hidden">
        <Image
          // src="/hero.png"
          // src="/hero.jpg"
          // src="/WhatsApp Image 2026-09-28 at 1.56.02 AM.jpeg"
          src="/ChatGPT Image Sep 28, 2026, 09_12_21 PM-Picsart-AiImageEnhancer.png"
          alt="Footballer training under floodlights"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00001A]/85 via-[#00001A]/45 to-[#00001A]/25" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-12 pt-24 sm:px-6 sm:pb-16 md:pt-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary sm:text-sm sm:tracking-[0.25em]">
            Football coaching · Digital programmes
          </p>
          <h1 className="mt-4 text-[#F4F7FB] max-w-4xl text-4xl leading-[0.95] sm:text-5xl md:text-7xl lg:text-8xl xl:text-[9rem]">
            Train like
            <br />
            the <span className="text-primary">elite.</span>
          </h1>
          <p className="mt-5 max-w-xl font-semibold text-base text-gray-300 sm:mt-6 sm:text-lg text-gray-100">
            Personal coaching and proven training programmes that turn hard work
            into match-day results.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 px-6 text-sm font-bold uppercase tracking-wider sm:text-base"
            >
              <Link href="/coaching">
                Book coaching <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 text-sm font-bold uppercase tracking-wider sm:text-base"
            >
              <Link href="/programmes">Browse programmes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x px-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.l} className="px-1 py-6 text-center sm:py-8">
              <div className="font-display text-3xl leading-none text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                {s.n}
              </div>
              <div className="mt-2 text-[10px] uppercase leading-tight tracking-wider text-muted-foreground sm:text-xs md:text-sm">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PICK YOUR PATH */}
      {/* PICK YOUR PATH */}
<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
    Two ways to train
  </p>
  <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
    Pick your path
  </h2>
  <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2">
    {[
      {
        img: "/IMG_8239.JPG",
        t: "Personal coaching",
        d: "Book a 1-to-1, small group or match analysis session with the coach.",
        to: "/coaching",
        cta: "See sessions",
        from: `From ${services[1].price}`,
      },
      {
        img: "/Copy of IMG_8212.JPG",
        t: "Digital programmes",
        d: "Structured video programmes you can follow anywhere, at your pace.",
        to: "/programmes",
        cta: "See programmes",
        from: `From ${formatPrice(Math.min(...programmes.map((p) => p.pricePence)))}`,
      },
    ].map((c) => (
      <Link
        key={c.t}
        href={c.to}
        className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden border sm:min-h-[26rem]"
      >
        <Image
          src={c.img}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay — dark at bottom fading to clear at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00001A]/85 via-[#00001A]/35 to-[#00001A]/15" />

        <div className="relative p-6 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            {c.from}
          </span>
          <h3 className="mt-2 text-3xl sm:text-4xl text-[#F4F7FB] lg:text-5xl">
            {c.t}
          </h3>
          <p className="mt-2 max-w-md text-sm text-gray-300 sm:text-base">
            {c.d}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary sm:text-base">
            {c.cta}{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    ))}
  </div>
</section>

      {/* HOW IT WORKS */}
      <section className="pitch-lines border-y">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 md:gap-12 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
              How it works
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              From sign-up to match day
            </h2>
          </div>
          <ol className="space-y-8">
            {[
              [
                "01",
                "Choose",
                "Pick a coaching session or a digital programme that fits your goals.",
              ],
              [
                "02",
                "Book or buy",
                "Pick a time that suits you, or unlock your programme instantly.",
              ],
              [
                "03",
                "Train",
                "Work with the coach or follow your programme from your dashboard.",
              ],
              [
                "04",
                "Perform",
                "Track progress, come back stronger and keep levelling up.",
              ],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-4 sm:gap-6">
                <span className="font-display text-3xl leading-none text-primary sm:text-4xl">
                  {n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-2xl sm:text-3xl">{t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    {d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Programmes
          </h2>
          <Link
            href="/programmes"
            className="hidden shrink-0 text-sm font-bold uppercase tracking-wider text-primary md:inline lg:text-base"
          >
            View all →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((p) => (
            <Link
              key={p.slug}
              href={`/programmes/${p.slug}`}
              className="group flex flex-col border bg-card p-6 transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>{p.weeks} weeks</span>
                <span>{p.level}</span>
              </div>
              <h3 className="mt-6 text-2xl sm:text-3xl lg:text-4xl">
                {p.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {p.tagline}
              </p>
              <ul className="mb-8 mt-6 space-y-2 text-sm">
                {p.outcomes.slice(0, 3).map((o) => (
                  <li key={o} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {o}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-4">
                <span className="font-display text-3xl sm:text-4xl">
                  {formatPrice(p.pricePence)}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-primary group-hover:underline sm:text-base">
                  Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection
        eyebrow="Reviews"
        title="What players say"
        limit={4}
        backgroundImage="/BS0Q9420.jpg"
      />

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 sm:py-16 md:flex-row md:items-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Ready to level up?
          </h2>
          <div className="flex w-full flex-wrap gap-3 md:w-auto">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 px-6 text-sm font-bold uppercase sm:text-base"
            >
              <Link href="/coaching">Book a session</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-primary-foreground bg-transparent px-6 text-sm font-bold uppercase text-primary-foreground hover:bg-primary-foreground hover:text-primary sm:text-base"
            >
              <Link href="/contact">Ask a question</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}