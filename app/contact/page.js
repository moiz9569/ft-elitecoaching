"use client";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api-client";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  topic: z.string().max(50),
  message: z.string().trim().min(1, "Please write a message").max(2000),
});

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    try {
      await apiPost("/api/contact", parsed.data);
      setSent(true);
    } catch {
      toast.error("Couldn't send your message. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main>
      <PageHero eyebrow="Contact" title="Talk to the coach">
        Not sure which session or programme is right? Send a message and you&apos;ll hear back within 24 hours.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <div className="flex gap-3"><Mail className="text-primary" /><div><div className="font-bold">Email</div><div className="text-muted-foreground">hello@ftelitecoaching.com</div></div></div>
          <div className="flex gap-3"><MapPin className="text-primary" /><div><div className="font-bold">Sessions</div><div className="text-muted-foreground">Local pitches · remote analysis worldwide</div></div></div>
        </div>
        {sent ? (
          <div className="border bg-card p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-5xl">Message sent</h2>
            <p className="mt-2 text-muted-foreground">Thanks — the coach will reply within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-5 border bg-card p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" maxLength={100} required /></div>
              <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" maxLength={255} required /></div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <select id="topic" name="topic" className="h-9 border bg-transparent px-3 text-sm">
                <option className="bg-card">Coaching sessions</option>
                <option className="bg-card">Programmes</option>
                <option className="bg-card">My account</option>
                <option className="bg-card">Other</option>
              </select>
            </div>
            <div className="grid gap-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={6} maxLength={2000} required /></div>
            <Button type="submit" size="lg" disabled={busy} className="font-bold uppercase tracking-wider">{busy ? "Sending…" : "Send message"}</Button>
          </form>
        )}
      </section>
    </main>
  );
}