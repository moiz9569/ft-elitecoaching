"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { programmes, lessonCount, getService } from "@/lib/data";
import { apiGet } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([apiGet("/api/purchases"), apiGet("/api/bookings")])
      .then(([pRes, bRes]) => {
        if (cancelled) return;
        setPurchases(pRes.purchases ?? []);
        setBookings(bRes.bookings ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load your dashboard");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(
    (b) => b.bookingDate && b.bookingDate >= today,
  );
  const past = bookings.filter((b) => !b.bookingDate || b.bookingDate < today);

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

  const nextSession = [...upcoming].sort((a, b) =>
    `${a.bookingDate}${a.bookingTime}`.localeCompare(
      `${b.bookingDate}${b.bookingTime}`,
    ),
  )[0];

  return (
    <PortalShell>
      <div className="px-6 py-10 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Member dashboard
        </p>
        <h1 className="mt-3 text-6xl md:text-7xl">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A quick look at your programmes, sessions and what&apos;s next.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Programmes
            </div>
            <div className="mt-2 font-display text-6xl text-primary">
              {purchases.length}
            </div>
          </div>
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Lessons done
            </div>
            <div className="mt-2 font-display text-6xl">
              {doneLessons}
              <span className="text-2xl text-muted-foreground">
                /{totalLessons}
              </span>
            </div>
          </div>
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Upcoming
            </div>
            <div className="mt-2 font-display text-6xl text-primary">
              {upcoming.length}
            </div>
          </div>
          <div className="border bg-card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Completed
            </div>
            <div className="mt-2 font-display text-6xl">{past.length}</div>
          </div>
        </div>

        {purchases.length > 0 && (
          <div className="mt-6 border bg-card p-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Overall programme progress</span>
              <span>{overallPct}%</span>
            </div>
            <Progress value={overallPct} className="mt-3 h-3" />
          </div>
        )}

        {nextSession && (
          <div className="mt-6 flex flex-col gap-4 border-2 border-primary/40 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <CalendarCheck className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Your next session
                </p>
                <h3 className="mt-1 text-3xl">{nextSession.serviceName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(nextSession.bookingDate)}
                  {nextSession.bookingTime &&
                    ` at ${formatTime(nextSession.bookingTime)}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {getService(nextSession.serviceSlug)?.meetLink && (
                <Button asChild className="font-bold uppercase">
                  <a
                    href={getService(nextSession.serviceSlug).meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Meet
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" className="font-bold uppercase">
                <Link href="/bookings">View all</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link
            href="/my-programmes"
            className="group flex flex-col border bg-card p-8 transition-colors hover:border-primary"
          >
            <BookOpen className="h-10 w-10 text-primary" />
            <h3 className="mt-6 text-4xl">My programmes</h3>
            <p className="mt-2 text-muted-foreground">
              {purchases.length === 0
                ? "You haven't unlocked any programmes yet."
                : `You own ${purchases.length} programme${
                    purchases.length === 1 ? "" : "s"
                  }. ${doneLessons}/${totalLessons} lessons complete.`}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-primary">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/bookings"
            className="group flex flex-col border bg-card p-8 transition-colors hover:border-primary"
          >
            <CalendarDays className="h-10 w-10 text-primary" />
            <h3 className="mt-6 text-4xl">My bookings</h3>
            <p className="mt-2 text-muted-foreground">
              {bookings.length === 0
                ? "No coaching sessions booked yet."
                : `${upcoming.length} upcoming · ${past.length} completed.`}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-primary">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        <div className="mt-12 flex flex-col gap-4 border bg-card p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="text-2xl">Want more?</h3>
              <p className="text-sm text-muted-foreground">
                Book a 1-to-1 session, or unlock a new training programme.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="font-bold uppercase">
              <Link href="/coaching">Book coaching</Link>
            </Button>
            <Button asChild variant="outline" className="font-bold uppercase">
              <Link href="/programmes">Browse programmes</Link>
            </Button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

function formatDate(d) {
  if (!d) return "Date not set";
  try {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function formatTime(t) {
  if (!t) return "";
  try {
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${m} ${suffix}`;
  } catch {
    return t;
  }
}

// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { BookOpen, PlayCircle, CheckCircle2 } from "lucide-react";
// import { PortalShell } from "@/components/portal/PortalShell";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { programmes, formatPrice, lessonCount } from "@/lib/data";
// import { apiGet } from "@/lib/api-client";
// import { useAuth } from "@/components/AuthProvider";
// import { toast } from "sonner";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [purchases, setPurchases] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     apiGet("/api/purchases")
//       .then(({ purchases }) => { if (!cancelled) setPurchases(purchases); })
//       .catch(() => { if (!cancelled) toast.error("Couldn't load your programmes"); })
//       .finally(() => { if (!cancelled) setIsLoading(false); });
//     return () => { cancelled = true; };
//   }, []);

//   const ownedSlugs = new Set(purchases.map((p) => p.programme_slug));
//   const totalLessons = purchases.reduce((n, p) => {
//     const prog = programmes.find((x) => x.slug === p.programme_slug);
//     return n + (prog ? lessonCount(prog) : 0);
//   }, 0);
//   const doneLessons = purchases.reduce((n, p) => n + (p.completed_lessons?.length ?? 0), 0);

//   return (
//     <PortalShell>
//       <div className="px-6 py-10 md:px-10">
//         <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Member dashboard</p>
//         <h1 className="mt-3 text-6xl md:text-7xl">Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
//         <p className="mt-3 max-w-xl text-muted-foreground">Your programmes, progress and next session — all in one place.</p>

//         <div className="mt-10 grid gap-6 md:grid-cols-3">
//           <div className="border bg-card p-6">
//             <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Programmes owned</div>
//             <div className="mt-2 font-display text-6xl text-primary">{purchases.length}</div>
//           </div>
//           <div className="border bg-card p-6">
//             <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lessons complete</div>
//             <div className="mt-2 font-display text-6xl">{doneLessons}<span className="text-2xl text-muted-foreground">/{totalLessons}</span></div>
//           </div>
//           <div className="border bg-card p-6">
//             <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overall progress</div>
//             <div className="mt-4"><Progress value={totalLessons ? (doneLessons / totalLessons) * 100 : 0} className="h-3" /></div>
//           </div>
//         </div>

//         <h2 className="mt-14 text-4xl">My programmes</h2>
//         {isLoading ? (
//           <p className="mt-4 text-muted-foreground">Loading…</p>
//         ) : purchases.length === 0 ? (
//           <div className="mt-6 border bg-card p-10 text-center">
//             <BookOpen className="mx-auto h-10 w-10 text-primary" />
//             <h3 className="mt-4 text-3xl">No programmes yet</h3>
//             <p className="mt-2 text-muted-foreground">Unlock a digital programme and train anywhere, at your own pace.</p>
//             <Button asChild className="mt-6 font-bold uppercase"><Link href="/programmes">Browse programmes</Link></Button>
//           </div>
//         ) : (
//           <div className="mt-6 grid gap-4 md:grid-cols-2">
//             {purchases.map((pur) => {
//               const prog = programmes.find((x) => x.slug === pur.programme_slug);
//               if (!prog) return null;
//               const total = lessonCount(prog);
//               const done = pur.completed_lessons?.length ?? 0;
//               const pct = total ? Math.round((done / total) * 100) : 0;
//               return (
//                 <div key={pur.id} className="border bg-card p-6">
//                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
//                     <span>{prog.weeks} weeks</span><span>{pct}%</span>
//                   </div>
//                   <h3 className="mt-3 text-4xl">{prog.name}</h3>
//                   <p className="mt-1 text-sm text-muted-foreground">{done}/{total} lessons complete</p>
//                   <Progress value={pct} className="mt-4 h-2" />
//                   <div className="mt-6 flex gap-2">
//                     <Button asChild className="font-bold uppercase"><Link href={`/learn/${prog.slug}`}><PlayCircle />Continue</Link></Button>
//                     <Button asChild variant="outline" className="font-bold uppercase"><Link href={`/programmes/${prog.slug}`}>Details</Link></Button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         <h2 className="mt-14 text-4xl">Not owned yet</h2>
//         <div className="mt-6 grid gap-4 md:grid-cols-3">
//           {programmes.filter((p) => !ownedSlugs.has(p.slug)).map((p) => (
//             <Link key={p.slug} href={`/programmes/${p.slug}`} className="group border bg-card p-6 transition-colors hover:border-primary">
//               <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground"><span>{p.weeks} weeks</span><span>{p.level}</span></div>
//               <h3 className="mt-4 text-3xl">{p.name}</h3>
//               <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
//               <div className="mt-6 flex items-center justify-between border-t pt-4">
//                 <span className="font-display text-3xl">{formatPrice(p.pricePence)}</span>
//                 <span className="text-sm font-bold uppercase tracking-wider text-primary group-hover:underline">Unlock →</span>
//               </div>
//             </Link>
//           ))}
//           {programmes.filter((p) => !ownedSlugs.has(p.slug)).length === 0 && (
//             <p className="text-muted-foreground">You own every programme. Nice work. 💪</p>
//           )}
//         </div>

//         <div className="mt-14 flex items-center gap-3 border bg-card p-6 text-sm text-muted-foreground">
//           <CheckCircle2 className="h-5 w-5 text-primary" />
//           Need a coach? <Link href="/coaching" className="font-bold text-primary hover:underline">Book a session</Link> for 1-to-1 time on the pitch.
//         </div>
//       </div>
//     </PortalShell>
//   );
// }

// function toastError(msg) {
//   // lazy import to avoid pulling sonner if not needed
//   import("sonner").then(({ toast }) => toast.error(msg));
// }
