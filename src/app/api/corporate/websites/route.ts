import { NextRequest, NextResponse } from "next/server";
import { appendCorporateAudit, getCorporateAdmin, parseWebsitePayload, requireCorporateAdmin } from "@/lib/corporate-admin-api";
import { readDb, writeDb } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  const db = readDb();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  let items = db.websiteListings || [];
  if (status) items = items.filter(i => i.status === status);
  if (category) items = items.filter(i => i.category === category);
  return NextResponse.json({ websiteListings: items, total: items.length });
}

export async function POST(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    const db = readDb();
    if (!db.websiteListings) db.websiteListings = [];
    const parsed = parseWebsitePayload(body);
    if (!parsed.value) return NextResponse.json({ error: parsed.error || "Invalid website details." }, { status: 400 });
    if (parsed.value.businessDivisionId && !db.businessDivisions.some((division) => division.id === parsed.value?.businessDivisionId)) {
      return NextResponse.json({ error: "Selected business division does not exist." }, { status: 400 });
    }
    if (db.websiteListings.some((website) => website.slug === parsed.value?.slug)) {
      return NextResponse.json({ error: "That website slug is already in use." }, { status: 409 });
    }
    const actor = await getCorporateAdmin();
    if (!actor) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    const now = new Date().toISOString();
    const newItem = {
      id: `web_${crypto.randomBytes(8).toString("hex")}`,
      ...parsed.value,
      createdAt: now,
      updatedAt: now,
    };
    db.websiteListings.unshift(newItem);
    const division = newItem.businessDivisionId && db.businessDivisions.find((item) => item.id === newItem.businessDivisionId);
    if (division && !division.websiteIds.includes(newItem.id)) division.websiteIds.push(newItem.id);
    appendCorporateAudit(db, actor, "Website listing created", newItem.name);
    writeDb(db);
    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
