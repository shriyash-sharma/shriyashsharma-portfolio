import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DashboardSession } from "@/lib/api/contracts/admin";
import { isUnauthorizedApiError, getAdminSession } from "@/lib/api/endpoints/admin-api";
import {
  dashboardAuthCookieName,
  dashboardHomePath,
  dashboardLoginPath,
} from "@/lib/auth/constants";

export const getDashboardSession = cache(async (): Promise<DashboardSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(dashboardAuthCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    return await getAdminSession(token);
  } catch (error) {
    if (isUnauthorizedApiError(error)) {
      return null;
    }

    throw error;
  }
});

export async function getDashboardAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(dashboardAuthCookieName)?.value ?? null;
}

export async function requireDashboardSession() {
  const session = await getDashboardSession();

  if (!session) {
    redirect(`${dashboardLoginPath}?next=${encodeURIComponent(dashboardHomePath)}`);
  }

  return session;
}
