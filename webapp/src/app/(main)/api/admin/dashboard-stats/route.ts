import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serialize } from "@/lib/serialize";

// Admin: dashboard summary. Ported from netlify/functions/dashboard-stats.js.
export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalRegistrations,
      totalStudents,
      revenueAgg,
      pendingAgg,
      registrationsThisMonth,
      courses,
    ] = await Promise.all([
      prisma.registration.count(),
      prisma.student.count(),
      prisma.registration.aggregate({ _sum: { paidAmount: true } }),
      prisma.registration.aggregate({
        _sum: { dueAmount: true },
        where: { dueAmount: { gt: 0 } },
      }),
      prisma.registration.count({ where: { registrationDate: { gte: monthStart } } }),
      prisma.course.findMany({
        select: { name: true, _count: { select: { courseRegistrations: true } } },
      }),
    ]);

    const popularCourses = courses
      .map((c) => ({ name: c.name, enrollment_count: c._count.courseRegistrations }))
      .sort((a, b) => b.enrollment_count - a.enrollment_count)
      .slice(0, 5);

    return NextResponse.json(
      serialize({
        totalRegistrations,
        totalStudents,
        totalRevenue: Number(revenueAgg._sum.paidAmount ?? 0),
        pendingPayments: Number(pendingAgg._sum.dueAmount ?? 0),
        registrationsThisMonth,
        popularCourses,
      }),
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 });
  }
}
