import { cookies } from "next/headers";
import { verifySessionToken } from "./security";
import { readDb, toPublicUser } from "./db";
import { PublicUser, Vendor } from "./types";

export const SESSION_COOKIE_NAME = "mdk_session";

export async function getCurrentUser(): Promise<PublicUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload) return null;

    const db = readDb();
    const user = db.users.find((u) => u.id === payload.userId);
    if (!user) return null;

    return toPublicUser(user);
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<PublicUser | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function requireVendor(): Promise<{
  user: PublicUser;
  vendor: Vendor;
} | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "vendor" && user.role !== "admin") return null;

  const db = readDb();
  let vendor = db.vendors?.find(
    (v) => v.userId === user.id || (user.vendorId && v.id === user.vendorId)
  );

  // If admin is inspecting vendor view, fallback to primary vendor or virtual vendor
  if (!vendor && user.role === "admin") {
    vendor = db.vendors?.[0];
  }

  if (!vendor) return null;
  return { user, vendor };
}
