// NOTE: this file must live in src/ (next to app/) or Next.js 16 silently ignores
// it and every /admin page and /api/admin route becomes public.
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "code_session";

function unauthorized(request: NextRequest) {
  const response = request.nextUrl.pathname.startsWith("/api/")
    ? NextResponse.json({ error: "Authentication required" }, { status: 401 })
    : NextResponse.redirect(new URL("/admin/login", request.url));

  // Drop a cookie we could not verify. Without this, a token the login page
  // accepts but the proxy rejects (e.g. the edge runtime seeing a different
  // AUTH_SECRET) bounces /admin -> /admin/login -> /admin forever and the
  // browser ends up on a blank page instead of the sign-in form.
  if (request.cookies.has(SESSION_COOKIE)) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    // The edge runtime only sees env vars captured at deploy time. If it has no
    // usable secret we cannot verify anything here, so let the request through to
    // the server-side guards (requireAdminPage / denyUnlessAdmin), which run in the
    // function runtime and do the real check. Rejecting here instead would loop:
    // /admin -> /admin/login (which sees a valid session) -> /admin -> ...
    console.error("[proxy] AUTH_SECRET is missing at the edge; deferring to server guards");
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return unauthorized(request);

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (
      typeof payload.id !== "number" ||
      typeof payload.username !== "string" ||
      payload.userType !== "admin"
    ) {
      return unauthorized(request);
    }
  } catch {
    return unauthorized(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
