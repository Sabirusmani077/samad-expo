import { NextRequest, NextResponse } from "next/server";
import { appendCorporateAudit, getCorporateAdmin, parseWebsitePayload, requireCorporateAdmin } from "@/lib/corporate-admin-api";
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
  const item = (db.websiteListings || []).find(
    i => i.id === id || i.slug === id
  );
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ websiteListing: item });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDb();
    const idx = (db.websiteListings || []).findIndex(i => i.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const parsed = parseWebsitePayload(body, db.websiteListings[idx]);
    if (!parsed.value) return NextResponse.json({ error: parsed.error || "Invalid website details." }, { status: 400 });
    if (parsed.value.businessDivisionId && !db.businessDivisions.some((division) => division.id === parsed.value?.businessDivisionId)) {
      return NextResponse.json({ error: "Selected business division does not exist." }, { status: 400 });
    }
    if (db.websiteListings.some((website, index) => index !== idx && website.slug === parsed.value?.slug)) {
      return NextResponse.json({ error: "That website slug is already in use." }, { status: 409 });
    }
    const actor = await getCorporateAdmin();
    if (!actor) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    const previousDivisionId = db.websiteListings[idx].businessDivisionId;
    db.websiteListings[idx] = {
      ...db.websiteListings[idx],
      ...parsed.value,
      id,
      updatedAt: new Date().toISOString(),
    };
    if (previousDivisionId && previousDivisionId !== db.websiteListings[idx].businessDivisionId) {
      const previousDivision = db.businessDivisions.find((division) => division.id === previousDivisionId);
      if (previousDivision) previousDivision.websiteIds = previousDivision.websiteIds.filter((websiteId) => websiteId !== id);
    }
    if (db.websiteListings[idx].businessDivisionId) {
      const division = db.businessDivisions.find((item) => item.id === db.websiteListings[idx].businessDivisionId);
      if (division && !division.websiteIds.includes(id)) division.websiteIds.push(id);
    }
    appendCorporateAudit(db, actor, "Website listing updated", db.websiteListings[idx].name);
    writeDb(db);
    return NextResponse.json({ success: true, item: db.websiteListings[idx] });
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
    const idx = (db.websiteListings || []).findIndex(i => i.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const actor = await getCorporateAdmin();
    if (!actor) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    appendCorporateAudit(db, actor, "Website listing deleted", db.websiteListings[idx].name);
    const division = db.businessDivisions.find((item) => item.id === db.websiteListings[idx].businessDivisionId);
    if (division) division.websiteIds = division.websiteIds.filter((websiteId) => websiteId !== id);
    db.websiteListings.splice(idx, 1);
    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
