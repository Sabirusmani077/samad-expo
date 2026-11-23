import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "mdk_session";
const SECRET_KEY =
  process.env.AUTH_JWT_SECRET ||
  "samad-expo-corporate-hardened-hmac-sha512-secret-2026";

interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "customer" | "vendor" | "admin";
  exp: number;
}

function base64urlToUint8(b64u: string): Uint8Array {
  let b64 = b64u.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function verifySessionTokenEdge(token: string): Promise<SessionPayload | null> {
  if (!token || !token.includes(".")) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlToUint8(signature) as unknown as BufferSource,
      enc.encode(data)
    );

    if (!valid) return null;

    const decoded = JSON.parse(
      new TextDecoder().decode(base64urlToUint8(data))
    ) as SessionPayload;

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionTokenEdge(token) : null;

  // 1. Protect Admin Routes (/admin, /admin/*, /api/admin/*)
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (isAdminPath) {
    if (!session || session.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Access denied. Administrator privileges required." },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Developer Workspace / Dashboard (/dashboard, /dashboard/*)
  const isDashboardPath = pathname.startsWith("/dashboard");
  if (isDashboardPath) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Prevent Logged-in Users from seeing Login/Register repeatedly
  if ((pathname === "/login" || pathname === "/register") && session) {
    const target = session.role === "admin" ? "/admin/corporate" : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 4. Continue Request with Hardened Security Response Headers
  const response = NextResponse.next();

  // Content Security Policy
  const isHostedSite = pathname.startsWith("/sites/");
  if (!isHostedSite) {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com; font-src 'self' data:; connect-src 'self'; frame-src 'self' https: http:; frame-ancestors 'self';"
    );
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
