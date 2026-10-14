import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public: enquiries from the /contact form. Saved to the `enquiries` table and
// worked from /admin/enquiries. A hidden honeypot field and a per-IP throttle
// keep casual spam out without a third-party captcha.

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  course?: string;
  message?: string;
  website?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s-]{6,20}$/;

// Best-effort throttle (per warm instance): 5 submissions per IP per 10 minutes.
const recent = new Map<string, number[]>();
function throttled(ip: string): boolean {
  const now = Date.now();
  const window = 10 * 60 * 1000;
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < window);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot filled → pretend success, store nothing.
  if ((body.website ?? "").trim()) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ error: "Too many enquiries from this connection. Please try again later or WhatsApp us." }, { status: 429 });
  }

  const name = (body.name ?? "").trim().slice(0, 160);
  const email = (body.email ?? "").trim().slice(0, 255);
  const phone = (body.phone ?? "").trim().slice(0, 30);
  const course = (body.course ?? "").trim().slice(0, 160);
  const message = (body.message ?? "").trim().slice(0, 2000);

  if (!name || !phone) {
    return NextResponse.json({ error: "Please give your name and a phone number so we can reach you." }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await prisma.enquiry.create({
      data: {
        name,
        phone,
        email: email || null,
        courseInterest: course || null,
        message: message || (course ? `Interested in ${course}.` : "General enquiry from the website."),
      },
    });
  } catch (error) {
    console.error("[contact] failed to save enquiry", error);
    return NextResponse.json({ error: "We couldn't save your enquiry right now. Please WhatsApp or call us." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
