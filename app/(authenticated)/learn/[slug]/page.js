import { notFound } from "next/navigation";
import { getProgramme, programmes } from "@/lib/data";
import LearnClient from "./LearnClient";

export const metadata = { title: "Training — FT Elite Coaching", robots: { index: false } };

export function generateStaticParams() {
  return programmes.map((p) => ({ slug: p.slug }));
}

export default async function LearnPage({ params }) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();
  return <LearnClient programme={programme} />;
}