import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, toPublicUser } from "@/lib/db";
import { hashPassword, signSessionToken } from "@/lib/security";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const phone = String(body.phone || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
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

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration error";
    return NextResponse.json(
      { error: `Unable to create account: ${message}` },
      { status: 500 }
    );
  }
}
