"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api-client";

export default function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!token) return toast.error("Reset link is missing or invalid");
    setBusy(true);
    try {
      await apiPost("/api/auth/reset-password/confirm", { token, password });
      toast.success("Password updated");
      router.push("/auth");
    } catch (err) {
      toast.error(err.message || "Could not reset password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={submit} className="grid w-full max-w-sm gap-4">
        <h1 className="text-5xl">New password</h1>
        <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="new-password" required /></div>
        <Button type="submit" disabled={busy} className="font-bold uppercase">{busy ? "Saving…" : "Update password"}</Button>
      </form>
    </main>
  );
}