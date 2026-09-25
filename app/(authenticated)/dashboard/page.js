"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, PlayCircle, CheckCircle2 } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { programmes, formatPrice, lessonCount } from "@/lib/data";
import { apiGet } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";

async function fetchPurchases() {
  const { purchases } = await apiGet("/api/purchases");
  return purchases;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: purchases = [], isLoading } = useQuery({ queryKey: ["purchases"], queryFn: fetchPurchases });

  const ownedSlugs = new Set(purchases.map((p) => p.programme_slug));
  const totalLessons = purchases.reduce((n, p) => {
    const prog = programmes.find((x) => x.slug === p.programme_slug);
    return n + (prog ? lessonCount(prog) : 0);
  }, 0);
  const doneLessons = purchases.reduce((n, p) => n + (p.completed_lessons?.length ?? 0), 0);

  return (
    <PortalShell>
      <div className="px-6 py-10 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Member dashboard</p>
        <h1 className="mt-3 text-6xl md:text-7xl">Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Your programmes, progress and next session — all in one place.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Programmes owned</div>
            <div className="mt-2 font-display text-6xl text-primary">{purchases.length}</div>
          </div>
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lessons complete</div>
            <div className="mt-2 font-display text-6xl">{doneLessons}<span className="text-2xl text-muted-foreground">/{totalLessons}</span></div>
          </div>
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overall progress</div>
            <div className="mt-4"><Progress value={totalLessons ? (doneLessons / totalLessons) * 100 : 0} className="h-3" /></div>
          </div>
        </div>

        <h2 className="mt-14 text-4xl">My programmes</h2>
        {isLoading ? (
          <p className="mt-4 text-muted-foreground">Loading…</p>
        ) : purchases.length === 0 ? (
          <div className="mt-6 border bg-card p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 text-3xl">No programmes yet</h3>
            <p className="mt-2 text-muted-foreground">Unlock a digital programme and train anywhere, at your own pace.</p>
            <Button asChild className="mt-6 font-bold uppercase"><Link href="/programmes">Browse programmes</Link></Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {purchases.map((pur) => {
              const prog = programmes.find((x) => x.slug === pur.programme_slug);
              if (!prog) return null;
              const total = lessonCount(prog);
              const done = pur.completed_lessons?.length ?? 0;
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <div key={pur.id} className="border bg-card p-6">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{prog.weeks} weeks</span><span>{pct}%</span>
                  </div>
                  <h3 className="mt-3 text-4xl">{prog.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{done}/{total} lessons complete</p>
                  <Progress value={pct} className="mt-4 h-2" />
                  <div className="mt-6 flex gap-2">
                    <Button asChild className="font-bold uppercase"><Link href={`/learn/${prog.slug}`}><PlayCircle />Continue</Link></Button>
                    <Button asChild variant="outline" className="font-bold uppercase"><Link href={`/programmes/${prog.slug}`}>Details</Link></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h2 className="mt-14 text-4xl">Not owned yet</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {programmes.filter((p) => !ownedSlugs.has(p.slug)).map((p) => (
            <Link key={p.slug} href={`/programmes/${p.slug}`} className="group border bg-card p-6 transition-colors hover:border-primary">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground"><span>{p.weeks} weeks</span><span>{p.level}</span></div>
              <h3 className="mt-4 text-3xl">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <span className="font-display text-3xl">{formatPrice(p.pricePence)}</span>
                <span className="text-sm font-bold uppercase tracking-wider text-primary group-hover:underline">Unlock →</span>
              </div>
            </Link>
          ))}
          {programmes.filter((p) => !ownedSlugs.has(p.slug)).length === 0 && (
            <p className="text-muted-foreground">You own every programme. Nice work. 💪</p>
          )}
        </div>

        <div className="mt-14 flex items-center gap-3 border bg-card p-6 text-sm text-muted-foreground">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Need a coach? <Link href="/coaching" className="font-bold text-primary hover:underline">Book a session</Link> for 1-to-1 time on the pitch.
        </div>
      </div>
    </PortalShell>
  );
}