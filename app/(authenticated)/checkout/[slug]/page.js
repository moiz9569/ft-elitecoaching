import { notFound } from "next/navigation";
import { getProgramme, programmes } from "@/lib/data";
import CheckoutClient from "./CheckoutClient";

export const metadata = { title: "Checkout — FT Elite Coaching", robots: { index: false } };

export function generateStaticParams() {
  return programmes.map((p) => ({ slug: p.slug }));
}

export default async function CheckoutPage({ params }) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();
  return <CheckoutClient programme={programme} />;
}