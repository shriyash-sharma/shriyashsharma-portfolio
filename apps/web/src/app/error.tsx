"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // When error tracking is added (e.g. Sentry), log here
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className="flex min-h-[60dvh] flex-col items-start justify-center gap-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
          Error
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--color-muted)] max-w-sm">
          An unexpected error occurred. Try refreshing the page.
        </p>
        <Button variant="secondary" size="md" onClick={reset}>
          Try again
        </Button>
      </div>
    </Container>
  );
}
