import { NextRequest, NextResponse } from "next/server";
import { searchCorporateEcosystem } from "@/lib/corporate-search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  if (query.trim().length > 100) {
    return NextResponse.json({ error: "Search query is too long." }, { status: 400 });
  }
  return NextResponse.json({
    query: query.trim(),
    results: searchCorporateEcosystem(query),
  });
}
