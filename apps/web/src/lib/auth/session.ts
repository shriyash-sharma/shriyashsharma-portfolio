export type DashboardRole = "owner" | "editor" | "viewer";

export type DashboardSession = {
  userId: string;
  email: string;
  roles: DashboardRole[];
};

/**
 * Server-side auth boundary for future dashboard routes.
 * Replace this with cookie/JWT validation once the FastAPI auth service exists.
 */
export async function getDashboardSession(): Promise<DashboardSession | null> {
  return null;
}

export async function requireDashboardSession(): Promise<DashboardSession> {
  const session = await getDashboardSession();

  if (!session) {
    throw new Error("Dashboard authentication is not configured yet.");
  }

  return session;
}
