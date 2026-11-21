import { NextRequest, NextResponse } from "next/server";
import { appendCorporateAudit, getCorporateAdmin, parseBusinessDivisionPayload, requireCorporateAdmin } from "@/lib/corporate-admin-api";
import { readDb, writeDb } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  const db = readDb();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  let items = db.businessDivisions || [];
  if (status) items = items.filter(i => i.status === status);
  return NextResponse.json({ businessDivisions: items, total: items.length });
}

export async function POST(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const body: unknown = await request.json();
    const db = readDb();
    if (!db.businessDivisions) db.businessDivisions = [];
    const parsed = parseBusinessDivisionPayload(body);
    if (!parsed.value) return NextResponse.json({ error: parsed.error || "Invalid business division details." }, { status: 400 });
    if (db.businessDivisions.some((division) => division.slug === parsed.value?.slug)) {
      return NextResponse.json({ error: "That business slug is already in use." }, { status: 409 });
    }
    const validWebsiteIds = new Set(db.websiteListings.map((website) => website.id));
    if (parsed.value.websiteIds.some((id) => !validWebsiteIds.has(id))) {
      return NextResponse.json({ error: "One or more selected websites do not exist." }, { status: 400 });
    }
    const actor = await getCorporateAdmin();
    if (!actor) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    const now = new Date().toISOString();
    const newItem = {
      id: `biz_${crypto.randomBytes(8).toString("hex")}`,
      ...parsed.value,
      createdAt: now,
      updatedAt: now,
    };
    db.businessDivisions.unshift(newItem);
    for (const website of db.websiteListings) {
      if (newItem.websiteIds.includes(website.id)) website.businessDivisionId = newItem.id;
    }
    appendCorporateAudit(db, actor, "Business division created", newItem.name);
    writeDb(db);
    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
