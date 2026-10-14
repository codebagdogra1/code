import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getSession, type SessionUser } from "@/lib/auth";

// Defence in depth. src/proxy.ts gates /admin and /api/admin/* at the edge; these
// helpers re-check the signed session inside server code so a misplaced proxy
// file or a direct action call can never expose the records office.

/** For server actions / route handlers: throws when there is no admin session. */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.userType !== "admin") {
    throw new Error("Not authorised");
  }
  return session;
}

/** For server components (layouts/pages): redirects to the sign-in screen. */
export async function requireAdminPage(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.userType !== "admin") {
    redirect("/admin/login");
  }
  return session;
}

/** For /api/admin route handlers: returns a 401 response to send when there is no
 *  admin session, or null when the caller may proceed. Mirrors src/proxy.ts so the
 *  API stays closed even if the edge proxy cannot verify sessions. */
export async function denyUnlessAdmin(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session || session.userType !== "admin") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return null;
}
