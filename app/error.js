"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl">This page didn&apos;t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => reset()} className="bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Try again</button>
          <a href="/" className="border px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}