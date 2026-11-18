"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmailLink } from "@/components/shared/email-link";
import { trackEvent } from "@/lib/analytics/ga";
import { cn } from "@/lib/utils/cn";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string }
  | { kind: "unavailable" };

const fieldClassName = cn(
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5",
  "text-[14px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-2)]",
  "transition-colors duration-[140ms] hover:border-[var(--color-border-strong)]",
  "focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
);

const labelClassName =
  "text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        trackEvent("contact_form_submit", { status: "sent" });
        return;
      }

      if (response.status === 503) {
        setStatus({ kind: "unavailable" });
        return;
      }

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus({
        kind: "error",
        message: payload?.error ?? "Something went wrong. Please try again.",
      });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClassName}>Name</span>
          <input
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className={fieldClassName}
          />
        </label>
        <label className="grid gap-2">
          <span className={labelClassName}>Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={fieldClassName}
          />
        </label>
      </div>
      <label className="grid gap-2">
        <span className={labelClassName}>Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className={cn(fieldClassName, "resize-y")}
        />
      </label>
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </Button>
        <p role="status" aria-live="polite" className="text-[14px] text-[var(--color-secondary)]">
          {status.kind === "sent" ? "Thanks — your message was sent. I'll reply by email." : null}
          {status.kind === "error" ? status.message : null}
          {status.kind === "unavailable" ? (
            <>
              The form isn&apos;t accepting messages right now. Please email{" "}
              <EmailLink className="text-[var(--color-foreground)] underline underline-offset-4" />.
            </>
          ) : null}
        </p>
      </div>
    </form>
  );
}
