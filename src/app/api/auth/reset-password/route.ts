import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { hashPassword } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const token = String(body.token || "").trim();
    const newPassword = String(body.newPassword || "");

    if (!email || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Email and a valid password (at least 6 characters) are required." },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "Password reset token is required." },
        { status: 400 }
      );
    }

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.email.toLowerCase() === email);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Invalid reset request or user not found." },
        { status: 400 }
      );
    }

    const user = db.users[userIndex];
    user.passwordHash = hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    db.users[userIndex] = user;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated. You can now log in.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to complete password reset." },
      { status: 400 }
    );
  }
}
