import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { hashPassword, verifyPasswordResetToken } from "@/lib/security";
import { rateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);

    // Rate Limiting: 5 attempts per 15 minutes per IP
    const limiter = rateLimit(`reset-pwd:${ip}`, 5, 15 * 60);
    if (!limiter.success) {
      return NextResponse.json(
        {
          error: `Too many password reset attempts. Please wait ${limiter.resetInSeconds} seconds before trying again.`,
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
    const token = String(body.token || "").trim();
    const newPassword = String(body.newPassword || "");

    if (!email || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Email and a valid new password (at least 8 characters) are required." },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "Valid password reset token is required." },
        { status: 400 }
      );
    }

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.email.toLowerCase() === email);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Invalid password reset request or token expired." },
        { status: 400 }
      );
    }

    const user = db.users[userIndex];

    // Cryptographically verify token signature against user's CURRENT password hash
    const verification = verifyPasswordResetToken(token, user.passwordHash);
    if (!verification.valid || verification.email !== email || verification.userId !== user.id) {
      return NextResponse.json(
        { error: verification.error || "Invalid or expired password reset token." },
        { status: 400 }
      );
    }

    // Set new password with modern PBKDF2 iterations
    user.passwordHash = hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    db.users[userIndex] = user;
    writeDb(db);

    // Clear rate limit bucket on successful password reset
    resetRateLimit(`reset-pwd:${ip}`);

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated and secured. You can now log in.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to complete password reset securely." },
      { status: 400 }
    );
  }
}
