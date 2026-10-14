import { NextResponse } from "next/server";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { serialize } from "@/lib/serialize";

// Admin only: list active courses with fees for the registration form. Rows carry
// fullPrice/monthlyPrice, which must never be served to the public site.
export async function GET() {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;

  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(serialize(courses));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
