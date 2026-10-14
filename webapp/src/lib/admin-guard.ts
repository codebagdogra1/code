import { getSession, type SessionUser } from "@/lib/auth";

// Defence in depth for server actions and admin route handlers: proxy.ts already
// gates /admin and /api/admin, but an action can be invoked by URL, so every
// mutating admin function also checks the signed session itself.
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.userType !== "admin") {
    throw new Error("Not authorised");
  }
  return session;
}
