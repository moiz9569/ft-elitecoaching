"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api-client";
import { useAuth } from "@/components/AuthProvider";

const safePath = (p) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/dashboard");

const creds = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export default function AuthForm() {
  const search = useSearchParams();
  const redirect = search.get("redirect") || undefined;
  const target = safePath(redirect);
  const router = useRouter();
  const { user, loading, refresh } = useAuth();
  const [mode, setMode] = useState("signin");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(target);
  }, [loading, user, router, target]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    setBusy(true);
    try {
      if (mode === "forgot") {
        const ok = z.string().email().safeParse(email);
        if (!ok.success) return toast.error("Enter a valid email");
        await apiPost("/api/auth/reset-password/request", { email });
        toast.success("Check your email for a reset link.");
        setMode("signin");
        return;
      }
      const parsed = creds.safeParse({ email, password: fd.get("password") });
      if (!parsed.success) return toast.error(parsed.error.issues[0].message);
      if (mode === "signup") {
        const full_name = String(fd.get("full_name") ?? "").trim().slice(0, 100);
        await apiPost("/api/auth/signup", { ...parsed.data, full_name });
        await refresh();
        router.replace(target);
      } else {
        await apiPost("/api/auth/signin", parsed.data);
        await refresh();
        router.replace(target);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = () => {
    if (redirect) sessionStorage.setItem("ft_redirect", target);
    window.location.href = "/api/auth/google";
  };

  return (
    <main className="grid min-h-[calc(100vh-4rem)] md:grid-cols-2">
      <div className="relative hidden md:block">
        <img src="/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-7xl">Your training.<br /><span className="text-primary">One place.</span></h2>
          <p className="mt-4 max-w-md text-muted-foreground">Access your programmes, track progress and manage your sessions from your member dashboard.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {checkEmail ? (
            <div className="text-center">
              <h1 className="text-5xl">Check your email</h1>
              <p className="mt-3 text-muted-foreground">We sent a confirmation link. Click it to activate your account and continue.</p>
              <Button variant="outline" className="mt-6" onClick={() => { setCheckEmail(false); setMode("signin"); }}>Back to sign in</Button>
            </div>
          ) : (
            <>
              <h1 className="text-6xl">{mode === "signup" ? "Join the squad" : mode === "forgot" ? "Reset password" : "Welcome back"}</h1>
              <p className="mt-2 text-muted-foreground">
                {mode === "signup" ? "Create your member account." : mode === "forgot" ? "We'll email you a reset link." : "Sign in to your member dashboard."}
              </p>
              {mode !== "forgot" && (
                <>
                  <Button type="button" variant="outline" className="mt-8 h-11 w-full" onClick={google}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.2 12 6.2c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.64 14.54 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 11.9S6.9 21.1 12 21.1c5.3 0 8.8-3.72 8.8-8.97 0-.6-.07-1.06-.15-1.53z" /></svg>
                    Continue with Google
                  </Button>
                  <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
                </>
              )}
              <form onSubmit={submit} className={`grid gap-4 ${mode === "forgot" ? "mt-8" : ""}`}>
                {mode === "signup" && <div className="grid gap-2"><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" maxLength={100} required /></div>}
                <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
                {mode !== "forgot" && (
                  <div className="grid gap-2">
                    <div className="flex justify-between"><Label htmlFor="password">Password</Label>{mode === "signin" && <button type="button" onClick={() => setMode("forgot")} className="text-xs text-muted-foreground hover:text-primary">Forgot?</button>}</div>
                    <Input id="password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
                  </div>
                )}
                <Button type="submit" disabled={busy} className="h-11 font-bold uppercase tracking-wider">
                  {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signup" ? (<>Already a member? <button onClick={() => setMode("signin")} className="font-bold text-primary">Sign in</button></>) :
                  mode === "forgot" ? (<button onClick={() => setMode("signin")} className="font-bold text-primary">Back to sign in</button>) :
                  (<>New here? <button onClick={() => setMode("signup")} className="font-bold text-primary">Create an account</button></>)}
              </p>
              <p className="mt-8 text-center text-xs text-muted-foreground"><Link href="/" className="hover:text-foreground">← Back to site</Link></p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}