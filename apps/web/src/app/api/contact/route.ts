/**
 * Contact form endpoint.
 *
 * Validates the submission, applies a per-IP rate limit, and silently drops
 * honeypot-filled (bot) submissions. Messages are addressed to
 * `siteConfig.author.email` (hello@shriyashsharma.com).
 */

import { NextResponse } from "next/server";

import { checkRateLimit, getRequestClientIp } from "@/lib/api/rate-limit";
import { siteConfig } from "@/lib/constants/site";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactSubmission = {
  name: string;
  email: string;
  message: string;
};

function parseSubmission(body: unknown): ContactSubmission | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const message = typeof record.message === "string" ? record.message.trim() : "";

  if (!name || name.length > MAX_NAME) {
    return { error: "Please enter your name." };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL) {
    return { error: "Please enter a valid email address." };
  }
  if (message.length < 10 || message.length > MAX_MESSAGE) {
    return { error: "Please enter a message (10–5000 characters)." };
  }

  return { name, email, message };
}

/**
 * TODO(contact-email): no email provider is configured for this project yet.
 * Wire one up here (e.g. Resend, Postmark, or SES) using a server-only API key
 * set in Vercel → Settings → Environment Variables — never commit the key.
 * Send `submission` to `to`, with `replyTo: submission.email`, and return true
 * on success. Until then the route responds 503 and the form shows the
 * direct email address instead.
 */
async function deliverContactEmail(
  submission: ContactSubmission,
  to: string
): Promise<boolean> {
  void submission;
  void to;
  return false;
}

export async function POST(request: Request) {
  const rate = checkRateLimit(`contact:${getRequestClientIp(request)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real users never see or fill the `company` field.
  if (body && typeof body === "object" && (body as Record<string, unknown>).company) {
    return NextResponse.json({ ok: true });
  }

  const submission = parseSubmission(body);
  if ("error" in submission) {
    return NextResponse.json({ error: submission.error }, { status: 400 });
  }

  const delivered = await deliverContactEmail(submission, siteConfig.author.email);
  if (!delivered) {
    return NextResponse.json(
      { error: "email_not_configured" },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
