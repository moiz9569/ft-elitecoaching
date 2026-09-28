import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials as allTestimonials } from "@/lib/data";

export function TestimonialsSection({
  title = "What players say",
  eyebrow = "Reviews",
  backgroundImage = "/coaching.jpg",
}) {
  // Always show all 4 testimonials
  const items = allTestimonials.slice(0, 4);

  if (items.length === 0) return null;

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
          Real feedback from players and coaches who&apos;ve trained with FT
          Elite.
        </p>

        {/* 1 col mobile, 2 cols tablet, 4 cols in ONE row on desktop */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => (
            <figure
              key={i}
              className="relative flex flex-col border border-white/15 bg-white/8 p-5 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/12"
            >
              {/* Header: quote mark + avatar + name/role, with bottom border */}
              <figcaption className="relative flex items-center gap-3 border-b border-white/15 pb-4">
                {t.avatar ? (
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-full border-2 border-white/30 object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 font-display text-lg text-white">
                    {t.author.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base tracking-wide text-white">
                    {t.author}
                  </div>
                  {t.role && (
                    <div className="mt-0.5 text-xs font-bold uppercase tracking-widest text-white/60">
                      {t.role}
                    </div>
                  )}
                </div>

                {/* Quote mark on the right side of header */}
                <span
                  aria-hidden
                  className="pointer-events-none -mb-2 font-display text-6xl leading-none text-white/15 select-none"
                >
                  &rdquo;
                </span>
              </figcaption>

              {/* Content below the border */}
              <div className="mt-4 flex flex-1 flex-col">
                {t.rating && (
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star
                        key={s}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                )}

                <blockquote className="flex-1 text-sm leading-relaxed text-white">
                  &quot;{t.quote}&quot;
                </blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}