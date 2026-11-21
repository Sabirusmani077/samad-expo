import { NextRequest, NextResponse } from "next/server";
import { requireCorporateAdmin, appendCorporateMutationAudit } from "@/lib/corporate-admin-api";
import { readDb, writeDb } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  const db = readDb();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  let items = db.corporateServices || [];
  if (status) items = items.filter(i => i.status === status);
  return NextResponse.json({ corporateServices: items, total: items.length });
}

export async function POST(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    const db = readDb();
    if (!db.corporateServices) db.corporateServices = [];
    const now = new Date().toISOString();
    const newItem = {
      id: `svc_${crypto.randomBytes(8).toString("hex")}`,
      ...body,
      createdAt: now,
      updatedAt: now,
    };
    db.corporateServices.unshift(newItem);
    await appendCorporateMutationAudit(db, 'services content changed', 'Administrator updated or removed a record.');
    writeDb(db);
    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
