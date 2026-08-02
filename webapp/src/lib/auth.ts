import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

// Signed, tamper-proof admin sessions. This replaces the old base64 "token" from the
// Netlify auth function (which anyone could forge). Sessions are stored in an
// httpOnly cookie so client JS can't read or spoof them.

export const SESSION_COOKIE = "code_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionUser = {
  id: number;
  username: string;
  userType: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short. Set it in your environment.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user } as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.id === "number" &&
      typeof payload.username === "string" &&
      typeof payload.userType === "string"
    ) {
      return { id: payload.id, username: payload.username, userType: payload.userType };
    }
    return null;
  } catch {
    return null;
  }
}

/** Read the current admin session from the request cookies (server components / routes). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
