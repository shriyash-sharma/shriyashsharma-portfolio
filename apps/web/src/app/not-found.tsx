import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[60dvh] flex-col items-start justify-center gap-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Page not found
        </h1>
        <p className="text-sm text-[var(--color-muted)] max-w-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild variant="secondary" size="md">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </Container>
  );
}
