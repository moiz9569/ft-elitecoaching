import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { programmes, services, formatPrice } from "@/lib/data";

export const metadata = {
  title: "FT Elite Coaching — Football coaching & training programmes",
  description: "Book 1-to-1 football coaching or train anywhere with FT Elite's digital programmes.",
  openGraph: { title: "FT Elite Coaching", description: "Book 1-to-1 football coaching or train anywhere with digital programmes." },
};

const stats = [
  { n: "500+", l: "Players coached" },
  { n: "40+", l: "Academy trials earned" },
  { n: "4.9★", l: "Average rating" },
];

const testimonials = [
  { q: "My son's first touch is unrecognisable after 6 sessions. He got into his club's A team.", a: "Sarah, parent" },
  { q: "The Speed & Agility programme is no joke. I'm winning races I used to lose.", a: "Jay, 16, winger" },
  { q: "Match analysis showed me things my coach never mentioned. Game changer.", a: "Tom, 19, midfielder" },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Footballer training under floodlights"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm sm:tracking-[0.25em]">
            Football coaching · Digital programmes
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem]">
            Train like<br />the <span className="text-primary">elite.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Personal coaching and proven training programmes that turn hard work into match-day results.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6 text-sm font-bold uppercase tracking-wider sm:text-base">
              <Link href="/coaching">Book coaching <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-sm font-bold uppercase tracking-wider sm:text-base">
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
              <div className="font-display text-3xl leading-none text-primary sm:text-4xl md:text-5xl lg:text-6xl">{s.n}</div>
              <div className="mt-2 text-[10px] uppercase leading-tight tracking-wider text-muted-foreground sm:text-xs md:text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PICK YOUR PATH */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">Two ways to train</p>
        <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Pick your path</h2>
        <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2">
          {[
            { img: "/coaching.jpg", t: "Personal coaching", d: "Book a 1-to-1, small group or match analysis session with the coach.", to: "/coaching", cta: "See sessions", from: `From ${services[1].price}` },
            { img: "/programme.jpg", t: "Digital programmes", d: "Structured video programmes you can follow anywhere, at your pace.", to: "/programmes", cta: "See programmes", from: `From ${formatPrice(Math.min(...programmes.map((p) => p.pricePence)))}` },
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
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative p-6 sm:p-8">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{c.from}</span>
                <h3 className="mt-2 text-3xl sm:text-4xl lg:text-5xl">{c.t}</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">{c.d}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary sm:text-base">
                  {c.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">How it works</p>
            <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">From sign-up to match day</h2>
          </div>
          <ol className="space-y-8">
            {[
              ["01", "Choose", "Pick a coaching session or a digital programme that fits your goals."],
              ["02", "Book or buy", "Pick a time that suits you, or unlock your programme instantly."],
              ["03", "Train", "Work with the coach or follow your programme from your dashboard."],
              ["04", "Perform", "Track progress, come back stronger and keep levelling up."],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-4 sm:gap-6">
                <span className="font-display text-3xl leading-none text-primary sm:text-4xl">{n}</span>
                <div className="min-w-0">
                  <h3 className="text-2xl sm:text-3xl">{t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Programmes</h2>
          <Link href="/programmes" className="hidden shrink-0 text-sm font-bold uppercase tracking-wider text-primary md:inline lg:text-base">
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
              <h3 className="mt-6 text-2xl sm:text-3xl lg:text-4xl">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{p.tagline}</p>
              <ul className="mb-8 mt-6 space-y-2 text-sm">
                {p.outcomes.slice(0, 3).map((o) => (
                  <li key={o} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{o}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-4">
                <span className="font-display text-3xl sm:text-4xl">{formatPrice(p.pricePence)}</span>
                <span className="text-sm font-bold uppercase tracking-wider text-primary group-hover:underline sm:text-base">Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">What players say</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.a} className="border-l-4 border-primary bg-background p-6">
                <blockquote className="text-base sm:text-lg">&quot;{t.q}&quot;</blockquote>
                <figcaption className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">{t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 sm:py-16 md:flex-row md:items-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Ready to level up?</h2>
          <div className="flex w-full flex-wrap gap-3 md:w-auto">
            <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-sm font-bold uppercase sm:text-base">
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











// import Link from "next/link";
// import { ArrowRight, Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { programmes, services, formatPrice } from "@/lib/data";

// export const metadata = {
//   title: "FT Elite Coaching — Football coaching & training programmes",
//   description: "Book 1-to-1 football coaching or train anywhere with FT Elite's digital programmes.",
//   openGraph: { title: "FT Elite Coaching", description: "Book 1-to-1 football coaching or train anywhere with digital programmes." },
// };

// const stats = [
//   { n: "500+", l: "Players coached" },
//   { n: "40+", l: "Academy trials earned" },
//   { n: "4.9★", l: "Average rating" },
// ];

// const testimonials = [
//   { q: "My son's first touch is unrecognisable after 6 sessions. He got into his club's A team.", a: "Sarah, parent" },
//   { q: "The Speed & Agility programme is no joke. I'm winning races I used to lose.", a: "Jay, 16, winger" },
//   { q: "Match analysis showed me things my coach never mentioned. Game changer.", a: "Tom, 19, midfielder" },
// ];

// export default function Home() {
//   return (
//     <main>
//       <section className="relative min-h-screen overflow-hidden -mt-16">
//         <img src="/hero.jpg" alt="Footballer training under floodlights" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
//         <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
//         <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6">
//           <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Football coaching · Digital programmes</p>
//           <h1 className="mt-4 max-w-4xl text-7xl sm:text-8xl md:text-[9rem]">Train like<br />the <span className="text-primary">elite.</span></h1>
//           <p className="mt-6 max-w-xl text-lg text-muted-foreground">Personal coaching and proven training programmes that turn hard work into match-day results.</p>
//           <div className="mt-8 flex flex-wrap gap-3">
//             <Button asChild size="lg" className="h-12 px-6 text-base font-bold uppercase tracking-wider"><Link href="/coaching">Book coaching <ArrowRight /></Link></Button>
//             <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base font-bold uppercase tracking-wider"><Link href="/programmes">Browse programmes</Link></Button>
//           </div>
//         </div>
//       </section>

//       <section className="border-y bg-card">
//         <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x px-4 sm:px-6">
//           {stats.map((s) => (
//             <div key={s.l} className="py-8 text-center">
//               <div className="font-display text-5xl text-primary md:text-6xl">{s.n}</div>
//               <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground md:text-sm">{s.l}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
//         <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Two ways to train</p>
//         <h2 className="mt-3 text-5xl md:text-7xl">Pick your path</h2>
//         <div className="mt-12 grid gap-6 md:grid-cols-2">
//           {[
//             { img: "/coaching.jpg", t: "Personal coaching", d: "Book a 1-to-1, small group or match analysis session with the coach.", to: "/coaching", cta: "See sessions", from: `From ${services[1].price}` },
//             { img: "/programme.jpg", t: "Digital programmes", d: "Structured video programmes you can follow anywhere, at your pace.", to: "/programmes", cta: "See programmes", from: `From ${formatPrice(Math.min(...programmes.map((p) => p.pricePence)))}` },
//           ].map((c) => (
//             <Link key={c.t} href={c.to} className="group relative block overflow-hidden border">
//               <img src={c.img} alt="" loading="lazy" width={1280} height={960} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
//               <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
//               <div className="absolute inset-x-0 bottom-0 p-8">
//                 <span className="text-xs font-bold uppercase tracking-widest text-primary">{c.from}</span>
//                 <h3 className="mt-2 text-5xl">{c.t}</h3>
//                 <p className="mt-2 max-w-md text-muted-foreground">{c.d}</p>
//                 <span className="mt-4 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-primary">{c.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       <section className="pitch-lines border-y">
//         <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-2">
//           <div>
//             <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">How it works</p>
//             <h2 className="mt-3 text-5xl md:text-7xl">From sign-up to match day</h2>
//           </div>
//           <ol className="space-y-8">
//             {[
//               ["01", "Choose", "Pick a coaching session or a digital programme that fits your goals."],
//               ["02", "Book or buy", "Pick a time that suits you, or unlock your programme instantly."],
//               ["03", "Train", "Work with the coach or follow your programme from your dashboard."],
//               ["04", "Perform", "Track progress, come back stronger and keep levelling up."],
//             ].map(([n, t, d]) => (
//               <li key={n} className="flex gap-6">
//                 <span className="font-display text-4xl text-primary">{n}</span>
//                 <div><h3 className="text-3xl">{t}</h3><p className="mt-1 text-muted-foreground">{d}</p></div>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </section>

//       <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
//         <div className="flex items-end justify-between gap-4">
//           <h2 className="text-5xl md:text-7xl">Programmes</h2>
//           <Link href="/programmes" className="hidden font-bold uppercase tracking-wider text-primary md:inline">View all →</Link>
//         </div>
//         <div className="mt-10 grid gap-6 md:grid-cols-3">
//           {programmes.map((p) => (
//             <Link key={p.slug} href={`/programmes/${p.slug}`} className="group border bg-card p-6 transition-colors hover:border-primary">
//               <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground"><span>{p.weeks} weeks</span><span>{p.level}</span></div>
//               <h3 className="mt-6 text-4xl">{p.name}</h3>
//               <p className="mt-2 text-muted-foreground">{p.tagline}</p>
//               <ul className="mt-6 space-y-2 text-sm">
//                 {p.outcomes.slice(0, 3).map((o) => <li key={o} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{o}</li>)}
//               </ul>
//               <div className="mt-8 flex items-center justify-between border-t pt-4">
//                 <span className="font-display text-4xl">{formatPrice(p.pricePence)}</span>
//                 <span className="font-bold uppercase tracking-wider text-primary group-hover:underline">Details →</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       <section className="border-t bg-card">
//         <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
//           <h2 className="text-5xl md:text-7xl">What players say</h2>
//           <div className="mt-10 grid gap-6 md:grid-cols-3">
//             {testimonials.map((t) => (
//               <figure key={t.a} className="border-l-4 border-primary bg-background p-6">
//                 <blockquote className="text-lg">&quot;{t.q}&quot;</blockquote>
//                 <figcaption className="mt-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.a}</figcaption>
//               </figure>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="bg-primary text-primary-foreground">
//         <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center">
//           <h2 className="text-5xl md:text-7xl">Ready to level up?</h2>
//           <div className="flex gap-3">
//             <Button asChild size="lg" variant="secondary" className="h-12 font-bold uppercase"><Link href="/coaching">Book a session</Link></Button>
//             <Button asChild size="lg" variant="outline" className="h-12 border-primary-foreground bg-transparent font-bold uppercase text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link href="/contact">Ask a question</Link></Button>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }