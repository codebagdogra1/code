import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

// Ported from netlify/functions/auth.js — same bcrypt check and 5-attempt / 15-min
// lockout, but issues a signed httpOnly session cookie instead of a forgeable token.
export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  if (user.lockedUntil && new Date() < user.lockedUntil) {
    const lockTime = user.lockedUntil.toLocaleTimeString();
    return NextResponse.json(
      { error: `Account locked until ${lockTime}. Too many failed attempts.` },
      { status: 423 },
    );
  }

  if (!user.isActive) {
    return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const failedAttempts = user.failedAttempts + 1;
    const lockedUntil =
      failedAttempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts, lockedUntil },
    });

    return NextResponse.json(
      {
        error: "Invalid username or password",
        attemptsRemaining: Math.max(0, MAX_ATTEMPTS - failedAttempts),
      },
      { status: 401 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedAttempts: 0, lockedUntil: null, lastLogin: new Date() },
  });

  const token = await createSessionToken({
    id: user.id,
    username: user.username,
    userType: user.userType,
  });
  await setSessionCookie(token);

  return NextResponse.json({
    success: true,
    user: { id: user.id, username: user.username, userType: user.userType },
    message: "Login successful",
  });
}
