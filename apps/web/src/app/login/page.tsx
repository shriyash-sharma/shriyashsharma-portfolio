import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { LoginForm } from "@/components/dashboard/login-form";
import { getDashboardSession } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dashboard Login",
  description: "Sign in to the engineering platform dashboard.",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage() {
  const session = await getDashboardSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_24%),var(--color-background)] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100dvh-6rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="max-w-xl">
          <div className="flex items-center gap-3">
            <BrandMark showWordmark={false} iconClassName="h-12" />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Operational CMS
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-5xl">
                Engineering content operations.
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-lg text-[15px] leading-8 text-[var(--color-secondary)]">
            A calm authoring surface for projects, articles, architecture notes,
            experiments, and publishing workflows. Session-backed, route-protected,
            and wired to the FastAPI admin boundary.
          </p>
        </section>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_96%,transparent)] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8">
          <div className="mb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted-2)]">
              Admin access
            </p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
              Sign in
            </h2>
            <p className="mt-2 text-[14px] text-[var(--color-muted)]">
              Use the configured bootstrap admin credentials from the backend environment.
            </p>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  );
}