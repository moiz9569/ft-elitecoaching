"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProgramme } from "@/lib/data";

export default function SuccessClient() {
  const params = useSearchParams();
  const programme = params.get("programme") || "";
  const ref = params.get("ref") || "";
  const p = getProgramme(programme);

  return (
    <main className="pitch-lines flex min-h-[75vh] items-center justify-center px-4">
      <div className="max-w-lg border bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 text-6xl">You&apos;re in.</h1>
        <p className="mt-3 text-muted-foreground">Payment successful. <strong className="text-foreground">{p?.name ?? "Your programme"}</strong> is now unlocked in your dashboard.</p>
        {ref && <p className="mt-2 text-xs text-muted-foreground">Order ref: {ref}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {p && <Button asChild size="lg" className="font-bold uppercase"><Link href={`/learn/${p.slug}`}>Start training</Link></Button>}
          <Button asChild size="lg" variant="outline" className="font-bold uppercase"><Link href="/dashboard">Go to dashboard</Link></Button>
        </div>
      </div>
    </main>
  );
}