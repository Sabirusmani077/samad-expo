import { NextRequest, NextResponse } from "next/server";
import { appendCorporateAudit, getCorporateAdmin, parseBusinessDivisionPayload, requireCorporateAdmin } from "@/lib/corporate-admin-api";
import { readDb, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  const { id } = await params;
  const db = readDb();
  const item = (db.businessDivisions || []).find(
    i => i.id === id || i.slug === id
  );
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ businessDivision: item });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const db = readDb();
    const idx = (db.businessDivisions || []).findIndex(i => i.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const parsed = parseBusinessDivisionPayload(body, db.businessDivisions[idx]);
    if (!parsed.value) return NextResponse.json({ error: parsed.error || "Invalid business division details." }, { status: 400 });
    if (db.businessDivisions.some((division, index) => index !== idx && division.slug === parsed.value?.slug)) {
      return NextResponse.json({ error: "That business slug is already in use." }, { status: 409 });
    }
    const validWebsiteIds = new Set(db.websiteListings.map((website) => website.id));
    if (parsed.value.websiteIds.some((websiteId) => !validWebsiteIds.has(websiteId))) {
      return NextResponse.json({ error: "One or more selected websites do not exist." }, { status: 400 });
    }
    const actor = await getCorporateAdmin();
    if (!actor) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    const previousWebsiteIds = new Set([
      ...(db.businessDivisions[idx].websiteIds || []),
      ...db.websiteListings.filter((website) => website.businessDivisionId === id).map((website) => website.id),
    ]);
    db.businessDivisions[idx] = {
      ...parsed.value,
      id,
      createdAt: db.businessDivisions[idx].createdAt,
      updatedAt: new Date().toISOString(),
    };
    for (const division of db.businessDivisions) {
      if (division.id !== id) division.websiteIds = division.websiteIds.filter((websiteId) => !db.businessDivisions[idx].websiteIds.includes(websiteId));
    }
    for (const website of db.websiteListings) {
      if (previousWebsiteIds.has(website.id) && website.businessDivisionId === id) website.businessDivisionId = null;
      if (db.businessDivisions[idx].websiteIds.includes(website.id)) website.businessDivisionId = id;
    }
    appendCorporateAudit(db, actor, "Business division updated", db.businessDivisions[idx].name);
    writeDb(db);
    return NextResponse.json({ success: true, item: db.businessDivisions[idx] });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const db = readDb();
    const idx = (db.businessDivisions || []).findIndex(i => i.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const actor = await getCorporateAdmin();
    if (!actor) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    const item = db.businessDivisions[idx];
    for (const website of db.websiteListings) {
      if ((item.websiteIds || []).includes(website.id) || website.businessDivisionId === id) website.businessDivisionId = null;
    }
    appendCorporateAudit(db, actor, "Business division deleted", item.name);
    db.businessDivisions.splice(idx, 1);
    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
