import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials as allTestimonials } from "@/lib/data";

export function TestimonialsSection({
  title = "What players say",
  eyebrow = "Reviews",
  limit,
  columns = 3,
  backgroundImage = "/coaching.jpg",
}) {
  const items = limit ? allTestimonials.slice(0, limit) : allTestimonials;

  if (items.length === 0) return null;

  const gridCols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />

      {/* Dark overlay so white text is readable everywhere */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-950/75 via-blue-950/55 to-blue-950/75" />

      {/* Subtle blue accent glow */}
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(37,99,235,0.35) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-32">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
          Real feedback from players and parents who&apos;ve trained with FT
          Elite.
        </p>

        <div className={`mt-12 grid gap-6 ${gridCols}`}>
          {items.map((t, i) => (
            <figure
              key={i}
              className="relative flex flex-col border border-white/15 bg-white/8 p-6 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/12 sm:p-7"
            >
              {/* Quote mark */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-2 font-display text-7xl leading-none text-white/10 select-none"
              >
                &rdquo;
              </span>

              {t.rating && (
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
              )}

              <blockquote className="relative flex-1 text-base leading-relaxed text-white sm:text-lg">
                &quot;{t.quote}&quot;
              </blockquote>

              <figcaption className="mt-5 border-t border-white/15 pt-4">
                <div className="font-display text-lg tracking-wide text-white">
                  {t.author}
                </div>
                {t.role && (
                  <div className="mt-0.5 text-xs font-bold uppercase tracking-widest text-white/60">
                    {t.role}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
