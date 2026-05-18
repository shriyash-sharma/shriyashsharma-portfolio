import { NextResponse } from "next/server";
import { dashboardAuthCookieName } from "@/lib/auth/constants";

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(dashboardAuthCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}