import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock } from "lucide-react";
import BookingForm from "./BookingForm";
import { getService, services } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: "Not found", robots: { index: false } };
  return {
    title: `${s.name} — FT Elite Coaching`,
    description: s.description,
    openGraph: { title: `${s.name} — FT Elite Coaching`, description: s.description },
  };
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <Link href="/coaching" className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
            ← All services
          </Link>
          <h1 className="mt-6 text-6xl md:text-8xl">{s.name}</h1>
          <p className="mt-4 text-xl text-muted-foreground">{s.tagline}</p>
          <p className="mt-6 text-lg">{s.description}</p>

          <h2 className="mt-10 text-3xl">What&apos;s included</h2>
          <ul className="mt-4 space-y-3">
            {s.includes.map((i) => (
              <li key={i} className="flex gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
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
            alt=""
            loading="lazy"
            width={1280}
            height={960}
            className="aspect-[4/3] w-full border object-cover"
          />
          <BookingForm service={s} />
        </div>
      </section>
    </main>
  );
}