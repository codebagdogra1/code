import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serialize } from "@/lib/serialize";

// Admin: returning-student lookup by phone. Behind the /api/admin proxy guard, so
// student PII is never exposed to the public. Lets the desk find an existing
// student and prefill their details instead of retyping (and silently overwriting)
// them at enrolment.
export async function GET(req: NextRequest) {
  const phone = (req.nextUrl.searchParams.get("phone") || "").trim();
  if (phone.length < 3) {
    return NextResponse.json({ students: [] });
  }

  try {
    const rows = await prisma.student.findMany({
      where: { phoneNumber: { contains: phone } },
      take: 6,
      orderBy: { id: "desc" },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        dateOfBirth: true,
        address: true,
        _count: { select: { registrations: true } },
      },
    });

    const students = rows.map((s) => ({
      id: s.id,
      full_name: s.fullName,
      phone_number: s.phoneNumber,
      email: s.email,
      // ISO yyyy-mm-dd for a native <input type="date">
      date_of_birth: s.dateOfBirth ? s.dateOfBirth.toISOString().slice(0, 10) : "",
      address: s.address ?? "",
      registrations_count: s._count.registrations,
    }));

    return NextResponse.json(serialize({ students }));
  } catch (error) {
    console.error("Error looking up students:", error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
