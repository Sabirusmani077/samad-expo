import { NextResponse } from "next/server";
import { requireAdmin } from "./auth";
import { AuditLogEntry, BusinessDivision, BusinessDivisionStatus, CompanyProfile, DatabaseSchema, PublicUser, WebsiteListing, WebsiteStatus } from "./types";
import crypto from "crypto";

export async function requireCorporateAdmin() {
  const user = await requireAdmin();
  if (user) return null;
  return NextResponse.json(
    { error: "Unauthorized. Admin access required." },
    { status: 401 }
  );
}

export async function getCorporateAdmin() {
  return requireAdmin();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function validImageReference(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!value) return true;
  if (value.startsWith("/uploads/") || value.startsWith("/images/")) {
    return !value.includes("..") && !value.includes("\\") && value.length <= 300;
  }
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch {
    return false;
  }
}

function validWebsiteUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!value) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch {
    return false;
  }
}

function validPreviewVideoUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /\.(mp4|webm|ogg)$/i.test(url.pathname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function parseCompanyProfilePayload(body: unknown): { value?: Partial<CompanyProfile>; error?: string } {
  if (!isPlainObject(body)) return { error: "A JSON object is required." };
  const value: Partial<CompanyProfile> = {};
  const stringLimits: Record<string, number> = {
    businessName: 160, legalName: 200, tagline: 300, about: 10_000, story: 10_000,
    vision: 5_000, mission: 5_000, founded: 80, headquarters: 300, founderName: 160,
    founderDesignation: 160, founderPhoto: 2048, founderBio: 10_000, founderMessage: 10_000,
    futureRoadmap: 10_000, contactEmail: 254, contactPhone: 50, contactAddress: 1000,
    logo: 2048, favicon: 2048,
  };
  for (const [key, maxLength] of Object.entries(stringLimits)) {
    if (body[key] === undefined) continue;
    const raw = body[key];
    if (typeof raw !== "string" || raw.length > maxLength) return { error: `${key} must be text with at most ${maxLength} characters.` };
    (value as Record<string, unknown>)[key] = raw.trim();
  }
  if (value.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.contactEmail)) return { error: "Contact email is invalid." };
  for (const imageKey of ["founderPhoto", "logo", "favicon"] as const) {
    if (value[imageKey] !== undefined && !validImageReference(value[imageKey])) return { error: `${imageKey} must be a valid image URL or uploaded media path.` };
  }
  for (const key of ["coreValues", "achievements"] as const) {
    if (body[key] === undefined) continue;
    const input = body[key];
    if (!Array.isArray(input) || input.length > 50 || !input.every((entry) => isPlainObject(entry))) return { error: `${key} must be a list of structured entries.` };
    const parsed = input.map((entry) => {
      const max = key === "coreValues" ? 1000 : 2000;
      const title = entry.title;
      const description = entry.description;
      const third = key === "coreValues" ? entry.icon : entry.year;
      if (typeof title !== "string" || title.length > 160 || typeof description !== "string" || description.length > max || typeof third !== "string" || third.length > 80) return null;
      return key === "coreValues"
        ? { title: title.trim(), description: description.trim(), icon: third.trim() }
        : { title: title.trim(), description: description.trim(), year: third.trim() };
    });
    if (parsed.some((entry) => !entry)) return { error: `${key} contains an invalid entry.` };
    (value as Record<string, unknown>)[key] = parsed;
  }
  if (body.socialLinks !== undefined) {
    if (!isPlainObject(body.socialLinks)) return { error: "Social links must be an object." };
    const links: Record<string, string> = {};
    for (const key of ["linkedin", "twitter", "instagram", "facebook", "youtube", "website"] as const) {
      const raw = body.socialLinks[key];
      if (raw === undefined) continue;
      if (typeof raw !== "string" || raw.length > 2048 || (raw && !validWebsiteUrl(raw))) return { error: `socialLinks.${key} must be a valid HTTP or HTTPS URL.` };
      links[key] = raw.trim();
    }
    value.socialLinks = { ...links } as CompanyProfile["socialLinks"];
  }
  if (body.brandColors !== undefined) {
    if (!isPlainObject(body.brandColors)) return { error: "Brand colors must be an object." };
    const colors: Record<string, string> = {};
    for (const key of ["primary", "accent"] as const) {
      const raw = body.brandColors[key];
      if (raw === undefined) continue;
      if (typeof raw !== "string" || !/^#[0-9a-fA-F]{6}$/.test(raw)) return { error: `brandColors.${key} must be a six-digit hex color.` };
      colors[key] = raw.toUpperCase();
    }
    value.brandColors = colors as CompanyProfile["brandColors"];
  }
  if (body.brandFontFamily !== undefined) {
    if (typeof body.brandFontFamily !== "string" || body.brandFontFamily.length > 100 || !/^[\w ,'-]*$/.test(body.brandFontFamily)) return { error: "Brand font family is invalid." };
    value.brandFontFamily = body.brandFontFamily.trim();
  }
  return { value };
}

const WEBSITE_STATUSES: WebsiteStatus[] = ["live", "under_development", "coming_soon", "temporarily_unavailable", "maintenance"];
const WEBSITE_OWNERSHIP = ["owned", "operated", "managed", "partnership", "external_partnership", "other"] as const;

export function parseBusinessDivisionPayload(
  body: unknown,
  existing?: BusinessDivision
): { value?: Omit<BusinessDivision, "id" | "createdAt" | "updatedAt">; error?: string } {
  if (!isPlainObject(body)) return { error: "A JSON object is required." };
  const readString = (key: string, fallback: string, max: number) => {
    const value = body[key] === undefined ? fallback : body[key];
    return typeof value === "string" && value.length <= max ? value.trim() : null;
  };
  const name = readString("name", existing?.name || "", 160);
  const slug = readString("slug", existing?.slug || "", 100)?.toLowerCase() || null;
  const category = readString("category", existing?.category || "", 100);
  if (!name || !slug || !category) return { error: "Name, slug, and category are required." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { error: "Slug must use lowercase letters, numbers, and single hyphens." };

  const logo = readString("logo", existing?.logo || "", 2048);
  const banner = readString("banner", existing?.banner || "", 2048);
  if (logo === null || !validImageReference(logo) || banner === null || !validImageReference(banner)) return { error: "Logo and banner must be valid image URLs or uploaded media paths." };
  const description = readString("description", existing?.description || "", 10_000);
  const shortDescription = readString("shortDescription", existing?.shortDescription || "", 500);
  const contactEmail = readString("contactEmail", existing?.contactEmail || "", 254);
  const contactPhone = readString("contactPhone", existing?.contactPhone || "", 50);
  if ([description, shortDescription, contactEmail, contactPhone].some((value) => value === null)) return { error: "A text field is too long." };
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) return { error: "Contact email is invalid." };

  const list = (key: string, fallback: string[]) => {
    const value = body[key] === undefined ? fallback : body[key];
    return Array.isArray(value) && value.length <= 100 && value.every((item) => typeof item === "string" && item.length <= 500)
      ? value.map((item) => item.trim()).filter(Boolean)
      : null;
  };
  const objectives = list("objectives", existing?.objectives || []);
  const productsAndServices = list("productsAndServices", existing?.productsAndServices || []);
  const websiteIds = list("websiteIds", existing?.websiteIds || []);
  if (!objectives || !productsAndServices || !websiteIds) return { error: "Objectives, offerings, and website associations must be lists of text." };

  const statuses: BusinessDivisionStatus[] = ["active", "inactive", "coming_soon"];
  const status = body.status === undefined ? existing?.status || "coming_soon" : body.status;
  if (typeof status !== "string" || !statuses.includes(status as BusinessDivisionStatus)) return { error: "Choose a valid business status." };
  const sortOrder = body.sortOrder === undefined ? existing?.sortOrder || 0 : body.sortOrder;
  if (typeof sortOrder !== "number" || !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 100_000) return { error: "Sort order must be a non-negative integer." };

  return {
    value: {
      name,
      slug,
      logo,
      banner,
      description: description || "",
      shortDescription: shortDescription || "",
      category,
      objectives,
      productsAndServices,
      websiteIds,
      contactEmail: contactEmail || "",
      contactPhone: contactPhone || "",
      status: status as BusinessDivisionStatus,
      sortOrder,
    },
  };
}

export function parseWebsitePayload(
  body: unknown,
  existing?: WebsiteListing
): { value?: Omit<WebsiteListing, "id" | "createdAt" | "updatedAt">; error?: string } {
  if (!isPlainObject(body)) return { error: "A JSON object is required." };
  const readString = (key: string, fallback: string, max: number) => {
    const value = body[key] === undefined ? fallback : body[key];
    return typeof value === "string" && value.length <= max ? value.trim() : null;
  };
  const name = readString("name", existing?.name || "", 160);
  const slug = readString("slug", existing?.slug || "", 100)?.toLowerCase() || null;
  const category = readString("category", existing?.category || "", 100);
  if (!name || !slug || !category) return { error: "Name, slug, and category are required." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { error: "Slug must use lowercase letters, numbers, and single hyphens." };

  const url = readString("url", existing?.url || "", 2048);
  const logo = readString("logo", existing?.logo || "", 2048);
  const banner = readString("banner", existing?.banner || "", 2048);
  const previewVideoUrl = readString("previewVideoUrl", existing?.previewVideoUrl || "", 2048);
  if (url === null || !validWebsiteUrl(url)) return { error: "Website URL must be a valid HTTP or HTTPS address." };
  if (logo === null || !validImageReference(logo) || banner === null || !validImageReference(banner)) return { error: "Logo and banner must be valid image URLs or uploaded media paths." };
  if (previewVideoUrl === null || !validPreviewVideoUrl(previewVideoUrl)) return { error: "Preview video must be a direct HTTPS MP4, WebM, or OGG URL." };

  const rawStatus = body.status === undefined ? existing?.status || "coming_soon" : body.status;
  if (typeof rawStatus !== "string" || !WEBSITE_STATUSES.includes(rawStatus as WebsiteStatus)) return { error: "Choose a valid website status." };
  const rawOwnership = body.ownershipType === undefined ? existing?.ownershipType || "owned" : body.ownershipType;
  if (typeof rawOwnership !== "string" || !WEBSITE_OWNERSHIP.includes(rawOwnership as (typeof WEBSITE_OWNERSHIP)[number])) return { error: "Choose a valid ownership relationship." };

  const list = (key: string, fallback: string[]) => {
    const value = body[key] === undefined ? fallback : body[key];
    return Array.isArray(value) && value.length <= 30 && value.every((item) => typeof item === "string" && item.length <= 500)
      ? value.map((item) => item.trim()).filter(Boolean)
      : null;
  };
  const screenshots = list("screenshots", existing?.screenshots || []);
  const features = list("features", existing?.features || []);
  const productsAndServices = list("productsAndServices", existing?.productsAndServices || []);
  if (!screenshots || screenshots.some((item) => !validImageReference(item))) return { error: "Screenshots must be valid image URLs or uploaded media paths." };
  if (!features || !productsAndServices) return { error: "Features and offerings must be lists of text." };

  const shortDescription = readString("shortDescription", existing?.shortDescription || "", 500);
  const description = readString("description", existing?.description || "", 10_000);
  if (shortDescription === null || description === null) return { error: "Descriptions are too long." };
  const rawLaunchDate = body.launchDate === undefined ? existing?.launchDate || null : body.launchDate === "" ? null : body.launchDate;
  if (rawLaunchDate !== null && (typeof rawLaunchDate !== "string" || Number.isNaN(Date.parse(rawLaunchDate)))) return { error: "Launch date is invalid." };
  const rawDivisionId = body.businessDivisionId === undefined ? existing?.businessDivisionId || null : body.businessDivisionId === "" ? null : body.businessDivisionId;
  if (rawDivisionId !== null && (typeof rawDivisionId !== "string" || rawDivisionId.length > 100)) return { error: "Business division selection is invalid." };
  const sortOrder = body.sortOrder === undefined ? existing?.sortOrder || 0 : body.sortOrder;
  if (typeof sortOrder !== "number" || !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 100_000) return { error: "Sort order must be a non-negative integer." };
  for (const flag of ["isPublic", "showOwnershipPublicly", "analyticsEnabled"] as const) {
    if (body[flag] !== undefined && typeof body[flag] !== "boolean") return { error: `${flag} must be true or false.` };
  }

  return {
    value: {
      name,
      slug,
      logo,
      banner,
      screenshots,
      previewVideoUrl: previewVideoUrl || "",
      description: description || "",
      shortDescription: shortDescription || "",
      category,
      features,
      productsAndServices,
      url,
      launchDate: rawLaunchDate as string | null,
      status: rawStatus as WebsiteStatus,
      businessDivisionId: rawDivisionId as string | null,
      ownershipType: rawOwnership as WebsiteListing["ownershipType"],
      showOwnershipPublicly: typeof body.showOwnershipPublicly === "boolean" ? body.showOwnershipPublicly : existing?.showOwnershipPublicly === true,
      analyticsEnabled: typeof body.analyticsEnabled === "boolean" ? body.analyticsEnabled : existing?.analyticsEnabled === true,
      isPublic: typeof body.isPublic === "boolean" ? body.isPublic : existing?.isPublic !== false,
      sortOrder,
    },
  };
}

export function appendCorporateAudit(
  db: DatabaseSchema,
  actor: PublicUser,
  action: string,
  details: string
) {
  const entry: AuditLogEntry = {
    id: `audit_${crypto.randomBytes(10).toString("hex")}`,
    userId: actor.id,
    userName: actor.name,
    userRole: actor.role,
    action,
    details: details.slice(0, 500),
    timestamp: new Date().toISOString(),
  };
  db.auditLogs ??= [];
  db.auditLogs.unshift(entry);
  db.auditLogs = db.auditLogs.slice(0, 1_000);
}

export async function appendCorporateMutationAudit(db: DatabaseSchema, action: string, details: string) {
  const actor = await getCorporateAdmin();
  if (actor) appendCorporateAudit(db, actor, action, details);
}
