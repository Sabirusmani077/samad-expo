import { NextRequest, NextResponse } from "next/server";
import { requireCorporateAdmin, appendCorporateMutationAudit } from "@/lib/corporate-admin-api";
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
  const item = (db.blogPosts || []).find(
    i => i.id === id || i.slug === id
  );
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ blogPost: item });
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
    const idx = (db.blogPosts || []).findIndex(i => i.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    db.blogPosts[idx] = {
      ...db.blogPosts[idx],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    await appendCorporateMutationAudit(db, 'blog content changed', 'Administrator updated or removed a record.');
    writeDb(db);
    return NextResponse.json({ success: true, item: db.blogPosts[idx] });
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
    const idx = (db.blogPosts || []).findIndex(i => i.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    db.blogPosts.splice(idx, 1);
    await appendCorporateMutationAudit(db, 'blog content changed', 'Administrator updated or removed a record.');
    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
