import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "code_session";

function unauthorized(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret || secret.length < 16) return unauthorized(request);

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
