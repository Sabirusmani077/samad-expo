import crypto from "crypto";

const SECRET_KEY =
  process.env.AUTH_JWT_SECRET ||
  "samad-expo-corporate-hardened-hmac-sha512-secret-2026";

// Modern PBKDF2 iteration count for new passwords
const MODERN_PBKDF2_ITERATIONS = 100_000;
const LEGACY_PBKDF2_ITERATIONS = 10_000;

/**
 * Hashes password using PBKDF2 with SHA-512 and random salt.
 * Formats:
 * - New: pbkdf2:100000:salt:hash
 * - Legacy: salt:hash (supported transparently)
 */
export function hashPassword(password: string, salt?: string, iterations = MODERN_PBKDF2_ITERATIONS): string {
  const actualSalt = salt || crypto.randomBytes(16).toString("hex");
  const derived = crypto
    .pbkdf2Sync(password, actualSalt, iterations, 64, "sha512")
    .toString("hex");
  return `pbkdf2:${iterations}:${actualSalt}:${derived}`;
}

/**
 * Timing-safe password verification supporting both modern and legacy password hashes.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== "string") return false;

  // Modern format: pbkdf2:<iterations>:<salt>:<hash>
  if (storedHash.startsWith("pbkdf2:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHash = parts[3];
    if (isNaN(iterations) || !salt || !originalHash) return false;

    const candidate = crypto
      .pbkdf2Sync(password, salt, iterations, 64, "sha512")
      .toString("hex");

    try {
      return crypto.timingSafeEqual(
        Buffer.from(originalHash, "hex"),
        Buffer.from(candidate, "hex")
      );
    } catch {
      return false;
    }
  }

  // Legacy format: <salt>:<hash>
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, originalHash] = parts;
  const candidate = crypto
    .pbkdf2Sync(password, salt, LEGACY_PBKDF2_ITERATIONS, 64, "sha512")
    .toString("hex");

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
  iat: number;
  jti: string;
}

/**
 * Signs a tamper-proof session JWT with SHA-256 HMAC and jti nonce.
 */
export function signSessionToken(
  payload: Omit<SessionPayload, "exp" | "iat" | "jti">,
  expiresInSeconds = 60 * 60 * 24 * 7
): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: SessionPayload = {
    ...payload,
    iat: now,
    jti: crypto.randomUUID(),
    exp: now + expiresInSeconds,
  };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Validates session token signature and expiration with timing-safe comparison.
 */
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

/**
 * Secure HTTP-only Cookie Options for Session Cookies
 */
export function getSessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Generates single-use, cryptographically signed password reset token.
 * Token is bound to user's existing password hash: once password is changed,
 * the token becomes immediately invalid.
 */
export function generatePasswordResetToken(
  userId: string,
  email: string,
  userPasswordHash: string,
  validityMinutes = 15
): string {
  const exp = Math.floor(Date.now() / 1000) + validityMinutes * 60;
  const payload = {
    userId,
    email: email.toLowerCase(),
    exp,
    purpose: "pwd_reset",
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const tokenSecret = `${SECRET_KEY}:${userPasswordHash}`;
  const sig = crypto.createHmac("sha256", tokenSecret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

/**
 * Validates password reset token signature, expiration and payload.
 */
export function verifyPasswordResetToken(
  token: string,
  userPasswordHash: string
): { valid: boolean; userId?: string; email?: string; error?: string } {
  if (!token || !token.includes(".")) {
    return { valid: false, error: "Malformed reset token." };
  }
  const [data, sig] = token.split(".");
  if (!data || !sig) {
    return { valid: false, error: "Malformed reset token." };
  }

  const tokenSecret = `${SECRET_KEY}:${userPasswordHash}`;
  const expectedSig = crypto.createHmac("sha256", tokenSecret).update(data).digest("base64url");

  try {
    const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
    if (!valid) {
      return { valid: false, error: "Invalid or expired reset token." };
    }

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (payload.purpose !== "pwd_reset") {
      return { valid: false, error: "Invalid token purpose." };
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: "Password reset token has expired. Please request a new one." };
    }

    return { valid: true, userId: payload.userId, email: payload.email };
  } catch {
    return { valid: false, error: "Invalid token payload." };
  }
}

export function generateOrderReference(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `SE-${datePart}-${randomPart}`;
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

/**
 * Basic input sanitization to strip dangerous script tags and null bytes.
 */
export function sanitizeInputText(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .trim();
}
