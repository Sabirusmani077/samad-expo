import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, toPublicUser } from "@/lib/db";
import { hashPassword, signSessionToken, getSessionCookieOptions, sanitizeInputText } from "@/lib/security";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { User } from "@/lib/types";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);

    // Rate Limiting: 5 registrations per hour per IP to prevent spam accounts
    const limiter = rateLimit(`register:${ip}`, 5, 60 * 60);
    if (!limiter.success) {
      return NextResponse.json(
        {
          error: `Registration limit exceeded. Please wait ${Math.ceil(
            limiter.resetInSeconds / 60
          )} minutes before registering another account.`,
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
    const name = sanitizeInputText(String(body.name || ""));
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const phone = sanitizeInputText(String(body.phone || ""));

    if (!name || name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: "Please enter your full name (between 2 and 80 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.length > 254 || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long for platform security." },
        { status: 400 }
      );
    }

    const db = readDb();
    const existing = db.users.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const id = `usr_${crypto.randomUUID().slice(0, 10)}`;

    const newUser: User = {
      id,
      name,
      email,
      phone,
      passwordHash: hashPassword(password),
      role: "customer",
      emailVerified: true,
      privacyConsent: true,
      savedAddresses: [],
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(newUser);
    writeDb(db);

    const token = signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const response = NextResponse.json(
      { user: toPublicUser(newUser), message: "Account created successfully." },
      { status: 201 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration error";
    return NextResponse.json(
      { error: `Unable to complete account registration securely: ${message}` },
      { status: 500 }
    );
  }
}
