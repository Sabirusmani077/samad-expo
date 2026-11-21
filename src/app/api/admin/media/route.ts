import { randomUUID } from "crypto";
import { mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireCorporateAdmin } from "@/lib/corporate-admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEDIA_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024;

function getImageExtension(buffer: Buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return ".jpg";
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return ".png";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return ".webp";
  return null;
}

export async function GET() {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const files = await readdir(MEDIA_DIR).catch(() => []);
    const items = files.filter((name) => /^[-a-f0-9]{36}\.(jpg|png|webp)$/i.test(name)).map((name) => ({ name, url: `/uploads/${name}` }));
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Unable to list media." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getImageExtension(buffer);
    if (!extension) {
      return NextResponse.json({ error: "Use a valid JPEG, PNG, or WebP image." }, { status: 415 });
    }

    await mkdir(MEDIA_DIR, { recursive: true });
    const name = `${randomUUID()}${extension}`;
    await writeFile(path.join(MEDIA_DIR, name), buffer, { flag: "wx" });
    return NextResponse.json({ item: { name, url: `/uploads/${name}` } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to upload image." }, { status: 400 });
  }
}
