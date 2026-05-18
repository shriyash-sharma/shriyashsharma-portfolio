/**
 * Server-side dashboard session accessors.
 *
 * This module is the authenticated entry point for Next.js server components
 * and layouts that need dashboard identity. It reads the same-origin cookie,
 * validates it against the backend session route, and normalizes unauthorized
 * states into redirects or null sessions.
 *
 * Caching is applied at the request level so one render tree can reuse the
 * resolved session without repeating backend calls.
 */

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
