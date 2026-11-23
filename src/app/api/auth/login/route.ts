import { NextRequest, NextResponse } from "next/server";
import { readDb, toPublicUser } from "@/lib/db";
import { signSessionToken, verifyPassword, getSessionCookieOptions } from "@/lib/security";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { rateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    
    // Strict Rate Limiting: 5 attempts per 15 minutes per IP
    const limiter = rateLimit(`login:${ip}`, 5, 15 * 60);
    if (!limiter.success) {
      return NextResponse.json(
        {
          error: `Too many login attempts. For your security, this account access is temporarily paused. Please try again in ${limiter.resetInSeconds} seconds.`,
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
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email address and password are required." },
        { status: 400 }
      );
    }

    const db = readDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    resetRateLimit(`login:${ip}`);

    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      vendorId: user.vendorId,
    });

    const response = NextResponse.json({
      user: toPublicUser(user),
      message: "Login successful.",
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to process login request securely." },
      { status: 400 }
    );
  }
}
