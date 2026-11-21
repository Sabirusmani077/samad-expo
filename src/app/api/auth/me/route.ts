import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readDb, toPublicUser, writeDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/security";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function PUT(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === currentUser.id);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user = db.users[userIndex];

    if (typeof body.name === "string" && body.name.trim()) {
      user.name = body.name.trim();
    }
    if (typeof body.phone === "string" && body.phone.trim()) {
      user.phone = body.phone.trim();
    }
    if (Array.isArray(body.savedAddresses)) {
      user.savedAddresses = body.savedAddresses;
    }

    // Optional password change
    if (body.currentPassword && body.newPassword) {
      if (!verifyPassword(String(body.currentPassword), user.passwordHash)) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }
      if (String(body.newPassword).length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }
      user.passwordHash = hashPassword(String(body.newPassword));
    }

    user.updatedAt = new Date().toISOString();
    db.users[userIndex] = user;
    writeDb(db);

    return NextResponse.json({ user: toPublicUser(user) });
  } catch {
    return NextResponse.json(
      { error: "Unable to update profile." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  if (currentUser.role === "admin") {
    return NextResponse.json(
      { error: "Primary administrator account cannot be deleted via self-service." },
      { status: 403 }
    );
  }

  const db = readDb();
  db.users = db.users.filter((u) => u.id !== currentUser.id);
  // Anonymize userId on past orders while preserving required tax/accounting records
  for (const order of db.orders) {
    if (order.userId === currentUser.id) {
      order.userId = null;
    }
  }
  writeDb(db);

  const response = NextResponse.json({ deleted: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
