import { randomUUID } from "crypto";
import { mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireCorporateAdmin } from "@/lib/corporate-admin-api";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEDIA_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB maximum

function getImageExtension(buffer: Buffer): string | null {
  // JPEG / JPG magic bytes: FF D8 FF
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return ".jpg";
  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return ".png";
  // WEBP magic bytes: RIFF .... WEBP
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return ".webp";
  // Reject SVG and other formats that could execute scripts
  return null;
}

export async function GET() {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;
  try {
    const files = await readdir(MEDIA_DIR).catch(() => []);
    const items = files
      .filter((name) => /^[-a-f0-9]{36}\.(jpg|png|webp)$/i.test(name))
      .map((name) => ({ name, url: `/uploads/${name}` }));
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Unable to list media." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireCorporateAdmin();
  if (denied) return denied;

  const ip = getClientIp(request.headers);
  const limiter = rateLimit(`media-upload:${ip}`, 30, 10 * 60);
  if (!limiter.success) {
    return NextResponse.json(
      { error: "Upload rate limit reached. Please wait before uploading more files." },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Choose a valid image file." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getImageExtension(buffer);
    if (!extension) {
      return NextResponse.json(
        { error: "Only genuine, verified JPEG, PNG, or WebP images are permitted for security." },
        { status: 415 }
      );
    }

    await mkdir(MEDIA_DIR, { recursive: true });
    const name = `${randomUUID()}${extension}`;
    await writeFile(path.join(MEDIA_DIR, name), buffer, { flag: "wx" });
    return NextResponse.json({ item: { name, url: `/uploads/${name}` } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to complete image upload safely." }, { status: 400 });
  }
}
