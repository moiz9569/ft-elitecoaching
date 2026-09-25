"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api-client";

const links = [
  { to: "/coaching", label: "Coaching" },
  { to: "/programmes", label: "Programmes" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Logo({ className = "" }) {
  return (
    <Link href="/" className={`flex min-w-0 items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 shrink-0 place-items-center bg-primary font-display text-lg text-primary-foreground">
        FT
      </span>
      <span className="truncate font-display text-xl tracking-wide sm:text-2xl">
        Elite Coaching
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { user, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const signOut = async () => {
    setOpen(false);
    await apiPost("/api/auth/signout");
    await refresh();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock body scroll while the menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // close if the viewport grows to desktop while open
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 ${
        open
          ? "border-b bg-background"
          : scrolled
          ? "border-b bg-background/85 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              aria-current={pathname === l.to ? "page" : undefined}
              className={`text-sm font-semibold uppercase tracking-wider ${
                pathname === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button asChild size="sm">
                <Link href="/dashboard">My Dashboard</Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
              <Button asChild size="sm">
                <Link href="/coaching">Book a session</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-mr-2 grid h-10 w-10 shrink-0 place-items-center md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t bg-background px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.to ? "page" : undefined}
                className={`font-display text-3xl ${
                  pathname === l.to ? "text-primary" : "text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl text-primary"
                >
                  My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl text-primary"
                >
                  Sign in
                </Link>
                <Button asChild size="lg" className="mt-2 h-12 font-bold uppercase tracking-wider">
                  <Link href="/coaching" onClick={() => setOpen(false)}>
                    Book a session
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:grid-cols-2 md:grid-cols-3">
        <div className="min-w-0">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Elite football coaching and training programmes for players who want more.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/coaching" className="text-muted-foreground hover:text-foreground">Coaching</Link>
          <Link href="/programmes" className="text-muted-foreground hover:text-foreground">Programmes</Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
        </div>
        <div className="text-sm text-muted-foreground sm:col-span-2 md:col-span-1 md:text-right">
          © {new Date().getFullYear()} FT Elite Coaching
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, children }) {
  return (
    <section className="pitch-lines border-b">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          {title}
        </h1>
        {children && (
          <div className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">{children}</div>
        )}
      </div>
    </section>
  );
}










// "use client";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Menu, X } from "lucide-react";
// import { useAuth } from "@/components/AuthProvider";
// import { Button } from "@/components/ui/button";
// import { apiPost } from "@/lib/api-client";

// const links = [
//   { to: "/coaching", label: "Coaching" },
//   { to: "/programmes", label: "Programmes" },
//   { to: "/about", label: "About" },
//   { to: "/contact", label: "Contact" },
// ];

// export function Logo() {
//   return (
//     <Link href="/" className="flex items-center gap-2">
//       <span className="grid h-8 w-8 place-items-center bg-primary font-display text-lg text-primary-foreground">FT</span>
//       <span className="font-display text-2xl tracking-wide">Elite Coaching</span>
//     </Link>
//   );
// }

// export function SiteHeader() {
//   const { user, refresh } = useAuth();
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();
//   const [scrolled, setScrolled] = useState(false); // ✅ NEW

//   const signOut = async () => {
//     await apiPost("/api/auth/signout");
//     await refresh();
//     router.push("/");
//     router.refresh();
//   };

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//       <header
//         className={`sticky top-0 z-40 ${
//           scrolled
//             ? "border-b bg-background/85 backdrop-blur-sm"
//             : "bg-transparent"
//         }`}
//       >

//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
//         <Logo />
//         <nav className="hidden items-center gap-8 md:flex">
//           {links.map((l) => (
//             <Link
//               key={l.to}
//               href={l.to}
//               className={`text-sm font-semibold uppercase tracking-wider ${
//                 pathname === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
//               }`}
//             >
//               {l.label}
//             </Link>
//           ))}
//         </nav>
//         <div className="hidden items-center gap-3 md:flex">
//           {user ? (
//             <>
//               <Button asChild size="sm"><Link href="/dashboard">My Dashboard</Link></Button>
//               <Button size="sm" variant="ghost" onClick={signOut}>Sign out</Button>
//             </>
//           ) : (
//             <>
//               <Link href="/auth" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">Sign in</Link>
//               <Button asChild size="sm"><Link href="/coaching">Book a session</Link></Button>
//             </>
//           )}
//         </div>
//         <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
//           {open ? <X /> : <Menu />}
//         </button>
//       </div>
//       {open && (
//         <div className="border-t px-4 py-4 md:hidden">
//           <div className="flex flex-col gap-4">
//             {links.map((l) => (
//               <Link key={l.to} href={l.to} onClick={() => setOpen(false)} className="font-display text-3xl">{l.label}</Link>
//             ))}
//             {user ? (
//               <>
//                 <Link href="/dashboard" onClick={() => setOpen(false)} className="font-display text-3xl text-primary">My Dashboard</Link>
//                 <button onClick={signOut} className="text-left text-muted-foreground">Sign out</button>
//               </>
//             ) : (
//               <Link href="/auth" onClick={() => setOpen(false)} className="font-display text-3xl text-primary">Sign in</Link>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

// export function SiteFooter() {
//   return (
//     <footer className="border-t">
//       <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
//         <div>
//           <Logo />
//           <p className="mt-3 max-w-xs text-sm text-muted-foreground">
//             Elite football coaching and training programmes for players who want more.
//           </p>
//         </div>
//         <div className="flex flex-col gap-2 text-sm">
//           <Link href="/coaching" className="text-muted-foreground hover:text-foreground">Coaching</Link>
//           <Link href="/programmes" className="text-muted-foreground hover:text-foreground">Programmes</Link>
//           <Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link>
//           <Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
//         </div>
//         <div className="text-sm text-muted-foreground md:text-right">
//           © {new Date().getFullYear()} FT Elite Coaching
//         </div>
//       </div>
//     </footer>
//   );
// }

// export function PageHero({ eyebrow, title, children }) {
//   return (
//     <section className="pitch-lines border-b">
//       <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
//         <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
//         <h1 className="mt-3 max-w-4xl text-6xl md:text-8xl">{title}</h1>
//         {children && <div className="mt-6 max-w-2xl text-lg text-muted-foreground">{children}</div>}
//       </div>
//     </section>
//   );
// }