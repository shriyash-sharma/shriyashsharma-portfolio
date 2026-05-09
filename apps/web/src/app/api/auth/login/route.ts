/**
 * Same-origin login bridge for the dashboard.
 *
 * The browser posts credentials to this Next.js route, which forwards them to
 * the backend auth API and stores the returned access token as an HttpOnly
 * cookie. This keeps credential exchange and cookie issuance on the web origin
 * instead of exposing backend auth mechanics directly to the client.
 */

import { NextResponse } from "next/server";
import type { AdminAuthResponse } from "@/lib/api/contracts/admin";
import { httpClient, ApiError } from "@/lib/api/http-client";
import { dashboardAuthCookieName } from "@/lib/auth/constants";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    email?: string;
    password?: string;
  };

  try {
    const response = await httpClient.post<AdminAuthResponse>(
      "/auth/login",
      payload,
      { cache: "no-store" }
    );

    const nextResponse = NextResponse.json({ user: response.user });
    nextResponse.cookies.set(dashboardAuthCookieName, response.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: response.expires_in,
    });
    return nextResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { detail: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json({ detail: "Unable to sign in" }, { status: 500 });
  }
}