import { NextRequest, NextResponse } from "next/server";
import { requireCorporateAdmin, appendCorporateMutationAudit } from "@/lib/corporate-admin-api";
import { readDb, writeDb } from "@/lib/db";
import { sanitizeInputText } from "@/lib/security";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";
import type { CorporateInquiry } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  const db = readDb();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  let items = db.corporateInquiries || [];
  if (status) items = items.filter(i => i.status === status);
  return NextResponse.json({ corporateInquiries: items, total: items.length });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);

    // Rate Limiting: 5 inquiries per 15 minutes per IP to prevent spamming
    const limiter = rateLimit(`inquiry:${ip}`, 5, 15 * 60);
    if (!limiter.success) {
      return NextResponse.json(
        {
          error: `Inquiry submission limit reached. Please wait ${limiter.resetInSeconds} seconds before submitting another inquiry.`,
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
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "A valid inquiry is required." }, { status: 400 });
    }
    const text = (key: string, maximum: number, required = false) => {
      const value = body[key];
      if (typeof value !== "string" || value.length > maximum || (required && !value.trim())) return null;
      return sanitizeInputText(value);
    };
    const name = text("name", 200, true);
    const email = text("email", 254, true);
    const phone = text("phone", 50) || "";
    const company = text("company", 200) || "";
    const subject = text("subject", 200, true);
    const message = text("message", 5_000, true);
    const relatedBusiness = text("relatedBusiness", 200) || "";

    if (!name || !email || !subject || !message || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid name, email, subject, and a message of at least 10 characters." }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json({ error: "Please agree to the inquiry data-use notice." }, { status: 400 });
    }
    const inquiryTypes = new Set<CorporateInquiry["inquiryType"]>(["general", "partnership", "careers", "media", "business"]);
    const inquiryType: CorporateInquiry["inquiryType"] = typeof body.inquiryType === "string" && inquiryTypes.has(body.inquiryType as CorporateInquiry["inquiryType"])
      ? body.inquiryType as CorporateInquiry["inquiryType"]
      : "business";

    const db = readDb();
    if (!db.corporateInquiries) db.corporateInquiries = [];
    const now = new Date().toISOString();
    const newItem = {
      id: `cinq_${crypto.randomBytes(8).toString("hex")}`,
      name,
      email,
      phone,
      company,
      subject,
      message,
      relatedBusiness,
      inquiryType,
      status: "new" as const,
      adminNotes: "",
      consentedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    db.corporateInquiries.unshift(newItem);
    await appendCorporateMutationAudit(db, 'inquiries content changed', 'Administrator updated or removed a record.');
    writeDb(db);
    return NextResponse.json({ success: true, message: "Inquiry received securely." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to process corporate inquiry." }, { status: 500 });
  }
}
