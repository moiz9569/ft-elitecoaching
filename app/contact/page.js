"use client";

import { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api-client";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  topic: z.string().max(50),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message")
    .max(2000),
});

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

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
      {/* =========================================================
          HERO
          ========================================================= */}
      <section className="relative overflow-hidden border-b">
        {/* IMAGE */}
        <Image
          src="/BS0Q9420_2560x1440.png"
          alt=""
          width={15360}
          height={4320}
          priority
          sizes="100vw"
          className="absolute left-0 top-0 h-auto w-full"
        />

        {/* DARK OVERLAY */}
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-[#00001A]/70 via-[#00001A]/55 to-[#00001A]/35" />

        {/* CONTENT */}
        <div className="relative mx-auto flex min-h-[430px] max-w-7xl items-center px-4 py-16 sm:min-h-[470px] sm:px-6 sm:py-20 lg:min-h-[500px] lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
              Contact
            </p>

            <h1 className="mt-3 max-w-4xl text-4xl leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-8xl">
              Talk to the coach
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Not sure which session or programme is right? Send a message
              and you&apos;ll hear back within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT CONTENT
          ========================================================= */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_2fr] lg:py-20">
        {/* CONTACT INFO */}
        <div className="space-y-6">
          <div className="flex gap-3">
            <Mail className="mt-0.5 shrink-0 text-primary" />

            <div>
              <div className="font-bold">
                Email
              </div>

              <div className="text-muted-foreground">
                hello@ftelitecoaching.com
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-0.5 shrink-0 text-primary" />

            <div>
              <div className="font-bold">
                Sessions
              </div>

              <div className="text-muted-foreground">
                Local pitches · remote analysis worldwide
              </div>
            </div>
          </div>
        </div>

        {/* SUCCESS */}
        {sent ? (
          <div className="border bg-card p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />

            <h2 className="mt-4 text-4xl sm:text-5xl">
              Message sent
            </h2>

            <p className="mt-2 text-muted-foreground">
              Thanks — the coach will reply within 24 hours.
            </p>
          </div>
        ) : (
          /* FORM */
          <form
            onSubmit={onSubmit}
            className="grid gap-5 border bg-card p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Name
                </Label>

                <Input
                  id="name"
                  name="name"
                  maxLength={100}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={255}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="topic">
                Topic
              </Label>

              <select
                id="topic"
                name="topic"
                defaultValue="Coaching sessions"
                className="h-9 border bg-transparent px-3 text-sm"
              >
                <option className="bg-card">
                  Coaching sessions
                </option>

                <option className="bg-card">
                  Programmes
                </option>

                <option className="bg-card">
                  My account
                </option>

                <option className="bg-card">
                  Other
                </option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">
                Message
              </Label>

              <Textarea
                id="message"
                name="message"
                rows={6}
                maxLength={2000}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="font-bold uppercase tracking-wider"
            >
              {busy ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}