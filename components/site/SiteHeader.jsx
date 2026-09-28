"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api-client";
import Image from "next/image";

const links = [
  { to: "/coaching", label: "Coaching" },
  { to: "/programmes", label: "Programmes" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const NAV_BG = "#F4F7FB";

export function Logo({ className = "", variant = "dark" }) {
  const textColor = variant === "light" ? "text-[#F4F7FB]" : "text-gray-600";
  return (
    <Link href="/" className={`flex min-w-0 items-center gap-2 ${className}`}>
      <Image
        src="/ft-elitecoaching-logo.png"
        alt="FT Elite Coaching"
        width={2048}
        height={2048}
        className="h-18 w-18 shrink-0 object-contain"
        priority
      />
      <span
        className={`truncate font-display text-xl tracking-wide transition-colors sm:text-2xl ${textColor}`}
      >
        Elite Coaching
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { user, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";

  // "solid" = navbar has opaque background + dark text
  // It's solid on any non-home page, or when scrolled past the hero,
  // or when the mobile menu is open.
  const solid = !isHome || pastHero || open;

  const signOut = async () => {
    setOpen(false);
    await apiPost("/api/auth/signout");
    await refresh();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const onScroll = () => {
      if (!isHome) {
        setPastHero(true);
        return;
      }
      // Hero height ≈ 100svh. Once we've scrolled ~one viewport down,
      // the navbar is no longer over the hero → switch to solid.
      setPastHero(window.scrollY > window.innerHeight - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        solid ? "shadow-[0_1px_0_0_rgba(0,0,0,0.06)]" : "shadow-none"
      }`}
      style={{
        backgroundColor: solid ? NAV_BG : "transparent",
        border: "none",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo variant={solid ? "dark" : "light"} />

        <nav
          className="hidden items-center gap-6 md:flex lg:gap-8"
          aria-label="Main"
        >
          {links.map((l) => {
            const active = pathname === l.to;
            const colorClass = solid
              ? active
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
              : active
                ? "text-primary"
                : "text-[#F4F7FB] hover:text-white";
            return (
              <Link
                key={l.to}
                href={l.to}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${colorClass}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button asChild size="sm">
                <Link href="/dashboard">My Dashboard</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={signOut}
                className={
                  solid
                    ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    : "text-[#F4F7FB] hover:bg-white/10 hover:text-white"
                }
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                  solid
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-[#F4F7FB] hover:text-white"
                }`}
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
          className={`-mr-2 grid h-10 w-10 shrink-0 place-items-center transition-colors md:hidden ${
            solid ? "text-gray-700" : "text-[#F4F7FB]"
          }`}
          style={{ border: "none" }}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100svh-4rem)] overflow-y-auto px-4 py-4 md:hidden"
          style={{
            backgroundColor: NAV_BG,
            border: "none",
          }}
        >
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.to ? "page" : undefined}
                className={`font-display text-3xl ${
                  pathname === l.to ? "text-primary" : "text-gray-800"
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
                  className="text-left text-sm font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900"
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
                <Button
                  asChild
                  size="lg"
                  className="mt-2 h-12 font-bold uppercase tracking-wider"
                >
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
            Elite football coaching and training programmes for players who want
            more.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link
            href="/coaching"
            className="text-muted-foreground hover:text-foreground"
          >
            Coaching
          </Link>
          <Link
            href="/programmes"
            className="text-muted-foreground hover:text-foreground"
          >
            Programmes
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          {title}
        </h1>
        {children && (
          <div className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
