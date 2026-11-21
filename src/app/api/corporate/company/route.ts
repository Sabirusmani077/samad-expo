import { NextRequest, NextResponse } from "next/server";
import { appendCorporateAudit, getCorporateAdmin, parseCompanyProfilePayload, requireCorporateAdmin } from "@/lib/corporate-admin-api";
import { readDb, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  const db = readDb();
  return NextResponse.json({ companyProfile: db.companyProfile });
}

export async function PUT(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const body: unknown = await request.json();
    const db = readDb();
    const parsed = parseCompanyProfilePayload(body);
    if (!parsed.value) return NextResponse.json({ error: parsed.error || "Invalid company profile." }, { status: 400 });
    const actor = await getCorporateAdmin();
    if (!actor) return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    db.companyProfile = {
      ...db.companyProfile,
      ...parsed.value,
      socialLinks: { ...db.companyProfile.socialLinks, ...parsed.value.socialLinks },
      brandColors: { primary: "#000000", accent: "#FFF33D", ...db.companyProfile.brandColors, ...parsed.value.brandColors },
    };
    appendCorporateAudit(db, actor, "Company profile updated", "Corporate identity and content");
    writeDb(db);
    return NextResponse.json({ success: true, companyProfile: db.companyProfile });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
