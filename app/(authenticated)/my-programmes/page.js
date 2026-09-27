"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookOpen, PlayCircle, Library } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { programmes, formatPrice, lessonCount } from "@/lib/data";
import { apiGet } from "@/lib/api-client";

export default function MyProgrammesPage() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiGet("/api/purchases")
      .then(({ purchases }) => {
        if (!cancelled) setPurchases(purchases ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load your programmes");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ownedSlugs = new Set(purchases.map((p) => p.programme_slug));
  const totalLessons = purchases.reduce((n, p) => {
    const prog = programmes.find((x) => x.slug === p.programme_slug);
    return n + (prog ? lessonCount(prog) : 0);
  }, 0);
  const doneLessons = purchases.reduce(
    (n, p) => n + (p.completed_lessons?.length ?? 0),
    0,
  );
  const overallPct = totalLessons
    ? Math.round((doneLessons / totalLessons) * 100)
    : 0;

  return (
    <PortalShell>
      <div className="px-6 py-10 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Training
        </p>
        <h1 className="mt-3 text-6xl md:text-7xl">My programmes</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every programme you own, with your progress and next lesson.
        </p>

        {/* Overall progress */}
        {purchases.length > 0 && (
          <div className="mt-10 border bg-card p-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>
                Overall progress · {purchases.length} programme
                {purchases.length === 1 ? "" : "s"}
              </span>
              <span>
                {doneLessons}/{totalLessons} lessons · {overallPct}%
              </span>
            </div>
            <Progress value={overallPct} className="mt-3 h-3" />
          </div>
        )}

        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading…</p>
        ) : purchases.length === 0 ? (
          <div className="mt-10 border bg-card p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary" />
            <h3 className="mt-4 text-4xl">No programmes yet</h3>
            <p className="mt-2 text-muted-foreground">
              Unlock a digital programme and train anywhere, at your own pace.
            </p>
            <Button asChild size="lg" className="mt-6 font-bold uppercase">
              <Link href="/programmes">Browse programmes</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {purchases.map((pur) => {
              const prog = programmes.find(
                (x) => x.slug === pur.programme_slug,
              );
              if (!prog) return null;
              const total = lessonCount(prog);
              const done = pur.completed_lessons?.length ?? 0;
              const pct = total ? Math.round((done / total) * 100) : 0;
              const completed = pct === 100;

              return (
                <div key={pur.id} className="border bg-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>{prog.weeks} weeks</span>
                        <span>·</span>
                        <span>{prog.level}</span>
                      </div>
                      <h3 className="mt-2 text-4xl">{prog.name}</h3>
                    </div>
                    {completed && (
                      <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                        Complete
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {prog.tagline}
                  </p>

                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <span>
                        {done}/{total} lessons
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-2 h-2" />
                  </div>

                  <div className="mt-6 flex gap-2 border-t pt-4">
                    <Button asChild className="font-bold uppercase">
                      <Link href={`/learn/${prog.slug}`}>
                        <PlayCircle />
                        {completed ? "Review" : done > 0 ? "Continue" : "Start"}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="font-bold uppercase"
                    >
                      <Link href={`/programmes/${prog.slug}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Not owned yet */}
        {purchases.length > 0 && (
          <>
            <h2 className="mt-16 text-4xl">More programmes</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {programmes
                .filter((p) => !ownedSlugs.has(p.slug))
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/programmes/${p.slug}`}
                    className="group border bg-card p-6 transition-colors hover:border-primary"
                  >
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <span>{p.weeks} weeks</span>
                      <span>{p.level}</span>
                    </div>
                    <h3 className="mt-4 text-3xl">{p.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {p.tagline}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                      <span className="font-display text-3xl">
                        {formatPrice(p.pricePence)}
                      </span>
                      <span className="text-sm font-bold uppercase tracking-wider text-primary group-hover:underline">
                        Unlock →
                      </span>
                    </div>
                  </Link>
                ))}
              {programmes.filter((p) => !ownedSlugs.has(p.slug)).length ===
                0 && (
                <p className="col-span-3 text-muted-foreground">
                  You own every programme. Nice work. 💪
                </p>
              )}
            </div>
          </>
        )}

        {/* Browse link for empty state */}
        {purchases.length > 0 && (
          <div className="mt-14 flex items-center gap-3 border bg-card p-6 text-sm text-muted-foreground">
            <Library className="h-5 w-5 text-primary" />
            Looking for something new?{" "}
            <Link
              href="/programmes"
              className="font-bold text-primary hover:underline"
            >
              Browse all programmes
            </Link>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
