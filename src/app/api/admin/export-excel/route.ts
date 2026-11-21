import { NextRequest, NextResponse } from "next/server";
import { requireCorporateAdmin } from "@/lib/corporate-admin-api";
import { generateMasterExcel, generateUsersExcel } from "@/lib/excel-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

    let buffer: Buffer;
    let fileName: string;

    if (type === "users") {
      buffer = generateUsersExcel();
      fileName = `samad-expo-registered-users-${timestamp}.xlsx`;
    } else {
      buffer = generateMasterExcel();
      fileName = `samad-expo-master-export-${timestamp}.xlsx`;
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to generate Excel export:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel file." },
      { status: 500 }
    );
  }
}
