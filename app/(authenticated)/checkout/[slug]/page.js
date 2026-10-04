import { notFound } from "next/navigation";
import { getService, getProgramme, services, programmes } from "@/lib/data";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout — FT Elite Coaching",
  robots: { index: false },
};

export function generateStaticParams() {
  return [
    ...services.map((s) => ({ slug: s.slug })),
    ...programmes.map((p) => ({ slug: p.slug })),
  ];
}

export default async function CheckoutPage({ params }) {
  const { slug } = await params;

  const asService = getService(slug);
  const asProgramme = getProgramme(slug);

  if (!asService && !asProgramme) notFound();

  const item = asService || asProgramme;
  const kind = asProgramme ? "subscription" : "oneoff";

  return <CheckoutClient item={item} kind={kind} />;
}