import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serialize } from "@/lib/serialize";

// Admin: list ALL courses (including inactive) for management.
export async function GET() {
  try {
    const courses = await prisma.course.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(serialize(courses));
  } catch (error) {
    console.error("Error listing courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

// Admin: create a course.
export async function POST(req: Request) {
  let body: {
    name?: string;
    duration?: string;
    full_price?: number;
    monthly_price?: number;
    monthly_installments?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.name) {
    return NextResponse.json({ error: "Course name is required" }, { status: 400 });
  }

  try {
    const course = await prisma.course.create({
      data: {
        name: body.name,
        duration: body.duration ?? null,
        fullPrice: body.full_price ?? null,
        monthlyPrice: body.monthly_price ?? null,
        monthlyInstallments: body.monthly_installments ?? 12,
      },
    });
    return NextResponse.json(serialize(course), { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
