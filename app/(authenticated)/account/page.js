"use client";
import { useState } from "react";
import { toast } from "sonner";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { useAsync } from "@/lib/hooks";

async function fetchProfile() {
  const { profile } = await apiGet("/api/profile");
  return profile;
}

export default function Account() {
  const { data: profile, refresh } = useAsync(fetchProfile, []);
  const [busy, setBusy] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!profile) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await apiPatch("/api/profile", {
        full_name: String(fd.get("full_name") ?? "").trim().slice(0, 100),
        position: String(fd.get("position") ?? "").slice(0, 30),
      });
      toast.success("Profile saved");
      refresh();
    } catch {
      toast.error("Couldn't save");
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const password = String(fd.get("password") ?? "");
    const current_password = String(fd.get("current_password") ?? "");
    if (password.length < 8) return toast.error("New password must be at least 8 characters");
    setPwBusy(true);
    try {
      await apiPost("/api/auth/change-password", { current_password, password });
      toast.success("Password updated");
      form.reset();
    } catch (err) {
      toast.error(err.message || "Could not update password");
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <PortalShell>
      <div className="px-6 py-10 md:px-10">
        <h1 className="text-6xl">Account</h1>
        {profile && (
          <div className="mt-8 grid max-w-4xl gap-6 lg:grid-cols-2">
            <form key={profile.id} onSubmit={saveProfile} className="grid gap-4 border bg-card p-6">
              <h2 className="text-3xl">Player profile</h2>
              <div className="grid gap-2"><Label>Email</Label><Input value={profile.email} disabled /></div>
              <div className="grid gap-2"><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" defaultValue={profile.full_name} maxLength={100} /></div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <select id="position" name="position" defaultValue={profile.position} className="h-9 border bg-transparent px-3 text-sm">
                  {["", "Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"].map((o) => <option key={o} value={o} className="bg-card">{o || "Select…"}</option>)}
                </select>
              </div>
              <Button type="submit" disabled={busy} className="font-bold uppercase">Save profile</Button>
            </form>
            <form onSubmit={changePassword} className="grid content-start gap-4 border bg-card p-6">
              <h2 className="text-3xl">Change password</h2>
              <div className="grid gap-2"><Label htmlFor="current_password">Current password</Label><Input id="current_password" name="current_password" type="password" autoComplete="current-password" /></div>
              <div className="grid gap-2"><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" autoComplete="new-password" /></div>
              <Button type="submit" variant="outline" disabled={pwBusy} className="font-bold uppercase">Update password</Button>
            </form>
          </div>
        )}
      </div>
    </PortalShell>
  );
}