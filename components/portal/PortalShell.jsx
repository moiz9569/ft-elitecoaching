"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  User,
  LogOut,
  Home,
  Library,
  CalendarCheck,
} from "lucide-react";
import { Logo } from "@/components/site/SiteHeader";
import { apiPost } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/my-programmes", label: "My programmes", icon: BookOpen },
  { to: "/bookings", label: "My bookings", icon: CalendarDays },
  { to: "/programmes", label: "Browse programmes", icon: Library },
  { to: "/coaching", label: "Book coaching", icon: CalendarCheck },
  { to: "/account", label: "Account", icon: User },
];

export function PortalShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { refresh } = useAuth();

  const signOut = async () => {
    await apiPost("/api/auth/signout");
    await refresh();
    router.push("/auth");
    router.refresh();
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b bg-sidebar md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm font-semibold hover:bg-sidebar-accent hover:text-foreground ${
                  active
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden space-y-1 border-t p-3 md:block">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Back to site
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
