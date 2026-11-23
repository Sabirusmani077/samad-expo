import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/security";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);

    // Rate Limiting: 3 password reset requests per 15 minutes per IP
    const limiter = rateLimit(`forgot-pwd:${ip}`, 3, 15 * 60);
    if (!limiter.success) {
      return NextResponse.json(
        {
          error: `Too many password reset requests. Please wait ${limiter.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limiter.resetInSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const db = readDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email);

    // Cryptographically signed time-limited (15-minute) reset token bound to current password hash
    const resetToken = user
      ? generatePasswordResetToken(user.id, user.email, user.passwordHash, 15)
      : undefined;

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a secure password reset token has been generated.",
      resetToken,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process password reset request." },
      { status: 400 }
    );
  }
}
