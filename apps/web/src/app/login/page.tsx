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
    <main className="min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_24%),var(--color-background)] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto grid max-w-5xl items-center gap-8 lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <section className="max-w-xl">
          <div className="flex items-center gap-3">
            <BrandMark showWordmark={false} iconClassName="h-10 sm:h-12" />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Operational CMS
              </p>
              <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-5xl">
                Engineering content operations.
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-lg text-[14px] leading-7 text-[var(--color-secondary)] sm:mt-6 sm:text-[15px] sm:leading-8">
            A calm authoring surface for projects, articles, architecture notes,
            experiments, and publishing workflows. Session-backed, route-protected,
            and wired to the FastAPI admin boundary.
          </p>
        </section>

        <section className="rounded-[24px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_96%,transparent)] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:rounded-[28px] sm:p-8">
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