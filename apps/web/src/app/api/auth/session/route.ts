import { NextResponse } from "next/server";
import { getDashboardSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getDashboardSession();

  if (!session) {
    return NextResponse.json(
      { detail: "Authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.json(session);
}