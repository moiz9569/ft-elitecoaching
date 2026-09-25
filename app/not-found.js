import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl text-primary">404</h1>
        <h2 className="mt-4 text-3xl">Offside — page not found</h2>
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center justify-center bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground">Go home</Link>
        </div>
      </div>
    </div>
  );
}