"use client";
import { usePathname } from "next/navigation";
import { SiteHeader, SiteFooter } from "./SiteHeader";

export default function SiteChrome({ children }) {
  const pathname = usePathname() || "";

  const isApp =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/my-programmes") ||
    pathname.startsWith("/my-subscriptions") ||
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/booking") ||
    pathname.startsWith("/subscription");

  return (
    <>
      {!isApp && <SiteHeader />}
      {children}
      {!isApp && <SiteFooter />}
    </>
  );
}