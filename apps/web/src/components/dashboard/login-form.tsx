"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { dashboardHomePath } from "@/lib/auth/constants";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || dashboardHomePath;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);

        startTransition(async () => {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { detail?: string }
              | null;
            setError(payload?.detail ?? "Unable to sign in.");
            return;
          }

          router.replace(next);
          router.refresh();
        });
      }}
    >
      <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
        Email
        <input
          className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[14px] text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-border-strong)]"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@localhost"
          required
        />
      </label>

      <label className="grid gap-2 text-[13px] text-[var(--color-secondary)]">
        Password
        <input
          className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[14px] text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-border-strong)]"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-200">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in to dashboard"}
      </Button>
    </form>
  );
}