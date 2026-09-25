"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, Lock, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lessonCount, formatPrice } from "@/lib/data";
import { apiGet, apiPatch } from "@/lib/api-client";

export default function LearnClient({ programme: p }) {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadPurchases = () =>
    apiGet("/api/purchases").then(({ purchases }) => setPurchases(purchases));

  useEffect(() => {
    let cancelled = false;
    apiGet("/api/purchases")
      .then(({ purchases }) => { if (!cancelled) setPurchases(purchases); })
      .catch(() => { if (!cancelled) toast.error("Couldn't load your programmes"); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const purchase = purchases.find((x) => x.programme_slug === p.slug);

  const lessons = useMemo(
    () => p.curriculum.flatMap((w) => w.lessons.map((l) => ({ ...l, week: w.title }))),
    [p]
  );
  const done = purchase?.completed_lessons ?? [];
  const firstIncomplete = lessons.find((l) => !done.includes(l.id))?.id ?? lessons[0].id;
  const currentId = activeId ?? firstIncomplete;
  const idx = lessons.findIndex((l) => l.id === currentId);
  const lesson = lessons[idx];

  if (isLoading) return <PortalShell><div className="p-10 text-muted-foreground">Loading…</div></PortalShell>;

  if (!purchase) {
    return (
      <PortalShell>
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="max-w-md border bg-card p-10 text-center">
            <Lock className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 text-5xl">{p.name} is locked</h1>
            <p className="mt-2 text-muted-foreground">Unlock lifetime access for {formatPrice(p.pricePence)}.</p>
            <Button asChild className="mt-6 font-bold uppercase"><Link href={`/checkout/${p.slug}`}>Unlock now</Link></Button>
          </div>
        </div>
      </PortalShell>
    );
  }

  const isDone = done.includes(lesson.id);

  const toggle = async () => {
    setSaving(true);
    const next = isDone ? done.filter((d) => d !== lesson.id) : [...done, lesson.id];
    try {
      await apiPatch(`/api/purchases/${purchase.id}`, { completed_lessons: next });
      if (!isDone) {
        toast.success("Lesson complete 💪");
        if (idx < lessons.length - 1) setActiveId(lessons[idx + 1].id);
      }
      await loadPurchases();
    } catch {
      toast.error("Couldn't save progress");
    } finally {
      setSaving(false);
    }
  };

  const pct = Math.round((done.length / lessonCount(p)) * 100);

  return (
    <PortalShell>
      <div className="grid lg:grid-cols-[1fr_340px]">
        <div className="p-6 md:p-10">
          <Link href="/dashboard" className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">← Dashboard</Link>
          <div className="relative mt-4 aspect-video overflow-hidden border">
            <img src="/programme.jpg" alt="" className="h-full w-full object-cover opacity-60" />
            <button className="absolute inset-0 grid place-items-center" onClick={() => toast("Video coming soon — the coach will upload lesson videos here.")}>
              <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="ml-1 h-8 w-8" /></span>
            </button>
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">{lesson.week} · {lesson.duration}</p>
          <h1 className="mt-2 text-5xl md:text-6xl">{lesson.title}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{lesson.summary}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="outline" disabled={idx === 0} onClick={() => setActiveId(lessons[idx - 1].id)}><ChevronLeft />Previous</Button>
            <Button onClick={toggle} disabled={saving} variant={isDone ? "secondary" : "default"} className="font-bold uppercase tracking-wider">
              <CheckCircle2 />{isDone ? "Completed — undo" : "Mark complete"}
            </Button>
            <Button variant="outline" disabled={idx === lessons.length - 1} onClick={() => setActiveId(lessons[idx + 1].id)}>Next<ChevronRight /></Button>
          </div>
        </div>
        <aside className="border-t bg-card lg:h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div className="border-b p-5">
            <h2 className="text-3xl">{p.name}</h2>
            <div className="mt-2 flex justify-between text-sm text-muted-foreground"><span>{done.length}/{lessonCount(p)} lessons</span><span>{pct}%</span></div>
            <Progress value={pct} className="mt-2 h-2" />
          </div>
          {p.curriculum.map((w) => (
            <div key={w.title}>
              <div className="bg-muted px-5 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{w.title}</div>
              {w.lessons.map((l) => (
                <button key={l.id} onClick={() => setActiveId(l.id)} className={`flex w-full items-center gap-3 border-b px-5 py-3 text-left text-sm hover:bg-accent ${l.id === currentId ? "bg-accent text-primary" : ""}`}>
                  {done.includes(l.id) ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  <span className="flex-1">{l.title}</span><span className="text-xs text-muted-foreground">{l.duration}</span>
                </button>
              ))}
            </div>
          ))}
        </aside>
      </div>
    </PortalShell>
  );
}