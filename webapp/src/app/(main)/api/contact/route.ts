import { NextResponse } from "next/server";

// Public: contact form submissions from /contact.
// For now this validates the payload and logs it server-side (visible in the
// Netlify function logs). Wiring an actual email/notification provider is a
// follow-up — the form + endpoint contract is in place so that swap is isolated.

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !message || (!email && !phone)) {
    return NextResponse.json(
      { error: "Please provide your name, a message, and an email or phone number." },
      { status: 400 },
    );
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // TODO: forward to email/CRM. Until then, log for the operator.
  console.log("[contact] new enquiry", { name, email, phone, message });

  return NextResponse.json({ ok: true });
}
