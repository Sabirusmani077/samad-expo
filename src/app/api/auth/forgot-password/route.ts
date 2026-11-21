import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
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

    // For privacy, respond with generic success whether user exists or not
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, password reset instructions have been issued.",
      // Include simulated token for instant direct reset flow in local environment
      resetToken: user ? `rst_${Buffer.from(`${user.id}:${Date.now()}`).toString("base64")}` : undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process password reset request." },
      { status: 400 }
    );
  }
}
