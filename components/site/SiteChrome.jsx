"use client";
import { usePathname } from "next/navigation";
import { SiteHeader, SiteFooter } from "./SiteHeader";

export default function SiteChrome({ children }) {
  const pathname = usePathname() || "";
  const isApp =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/checkout");

  return (
    <>
      {!isApp && <SiteHeader />}
      {children}
      {!isApp && <SiteFooter />}
    </>
  );
}