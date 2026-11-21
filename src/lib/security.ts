import crypto from "crypto";

const SECRET_KEY =
  process.env.AUTH_JWT_SECRET ||
  "mdk-enterprises-local-dev-hmac-secret-key-2026-change-in-prod";

export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString("hex");
  const derived = crypto
    .pbkdf2Sync(password, actualSalt, 10000, 64, "sha512")
    .toString("hex");
  return `${actualSalt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, originalHash] = parts;
  const candidate = hashPassword(password, salt).split(":")[1];
  try {
    return crypto.timingSafeEqual(
      Buffer.from(originalHash, "hex"),
      Buffer.from(candidate, "hex")
    );
  } catch {
    return false;
  }
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "customer" | "vendor" | "admin";
  vendorId?: string;
  exp: number;
}

export function signSessionToken(
  payload: Omit<SessionPayload, "exp">,
  expiresInSeconds = 60 * 60 * 24 * 7
): string {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(data)
    .digest("base64url");

  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!valid) return null;
    const decoded = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    ) as SessionPayload;
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function generateOrderReference(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `MDK-${datePart}-${randomPart}`;
}

export function generateTrackingToken(): string {
  return `trk_${crypto.randomBytes(16).toString("hex")}`;
}

export function computePaymentSignature(
  gatewayOrderId: string,
  gatewayPaymentId: string
): string {
  const secret =
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.CASHFREE_SECRET_KEY ||
    SECRET_KEY;
  return crypto
    .createHmac("sha256", secret)
    .update(`${gatewayOrderId}|${gatewayPaymentId}`)
    .digest("hex");
}

export function verifyPaymentSignature(
  gatewayOrderId: string,
  gatewayPaymentId: string,
  providedSignature: string
): boolean {
  const expected = computePaymentSignature(gatewayOrderId, gatewayPaymentId);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(providedSignature, "hex")
    );
  } catch {
    return false;
  }
}
