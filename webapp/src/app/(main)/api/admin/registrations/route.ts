import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serialize } from "@/lib/serialize";

// Admin: paginated list of registrations with student info and an overdue-months
// count. Ported from netlify/functions/registrations.js (GET list).
export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    const now = new Date();

    const [rows, totalRecords] = await Promise.all([
      prisma.registration.findMany({
        orderBy: { registrationDate: "desc" },
        skip,
        take: limit,
        include: {
          student: { select: { fullName: true, phoneNumber: true, email: true } },
          // Per-course write-off parks a single course's months as CANCELLED but
          // leaves the registration's stored dueAmount/paymentStatus alone. We load
          // the installments to derive the live Due and status so a multi-course row
          // with one course written off doesn't keep showing the parked amount.
          monthlyInstallments: {
            select: {
              courseId: true,
              paymentStatus: true,
              dueDate: true,
              installmentAmount: true,
              paidAmount: true,
            },
          },
          // The courses on this registration, with names, so the row can show
          // which course(s) the student is still enrolled in — not just a bare
          // "written off" count. Also drives the course_count that hides the
          // whole-registration cancel button for multi-course rows.
          courseRegistrations: {
            select: { courseId: true, course: { select: { name: true } } },
          },
        },
      }),
      prisma.registration.count(),
    ]);

    const registrations = rows.map((r) => {
      let overdueMonths = 0;
      // Outstanding (amount − paid) on parked months, and which courses are parked.
      let cancelledOutstanding = 0;
      const cancelledCourses = new Set<number>();
      const pendingCourses = new Set<number>();
      const activeCourses = new Set<number>();
      for (const mi of r.monthlyInstallments) {
        const status = mi.paymentStatus?.toUpperCase();
        if (status === "CANCELLED") {
          const amt = Number(mi.installmentAmount) - Number(mi.paidAmount ?? 0);
          cancelledOutstanding += amt > 0 ? amt : 0;
          if (mi.courseId != null) cancelledCourses.add(mi.courseId);
        } else {
          if (mi.courseId != null) activeCourses.add(mi.courseId);
          if (status === "PENDING") {
            if (mi.courseId != null) pendingCourses.add(mi.courseId);
            if (mi.dueDate && mi.dueDate < now) overdueMonths += 1;
          }
        }
      }

      // A course is written off when it has parked months and none still pending.
      const writtenOffCourses = new Set<number>();
      for (const c of cancelledCourses) if (!pendingCourses.has(c)) writtenOffCourses.add(c);
      const writtenOffCount = writtenOffCourses.size;

      // Per-course labels for the row: the course name plus whether it's parked,
      // so the desk sees the active course alongside any written-off one.
      const courses = r.courseRegistrations.map((cr) => ({
        name: cr.course?.name ?? "Course",
        written_off: cr.courseId != null && writtenOffCourses.has(cr.courseId),
      }));

      const liveDue = Math.max(0, Math.round(r.dueAmount - cancelledOutstanding));

      // Stored dueAmount/paymentStatus are stale after a partial write-off (some
      // courses parked, others still active). Derive the row's status from the
      // live Due so it stops reading as "Cancelled" while the student is enrolled.
      let displayStatus = r.paymentStatus;
      if (writtenOffCount > 0 && activeCourses.size > 0) {
        displayStatus = liveDue <= 0 ? "COMPLETED" : r.paidAmount > 0 ? "PARTIAL" : "PENDING";
      }

      return {
        id: r.id,
        receipt_no: r.receiptNo,
        registration_date: r.registrationDate,
        total_amount: r.totalAmount,
        admission_fees: r.admissionFees,
        paid_amount: r.paidAmount,
        due_amount: liveDue,
        payment_method: r.paymentMethod,
        payment_status: displayStatus,
        full_name: r.student?.fullName ?? "",
        phone_number: r.student?.phoneNumber ?? "",
        email: r.student?.email ?? null,
        overdue_months: overdueMonths,
        course_count: r.courseRegistrations.length,
        written_off_course_count: writtenOffCount,
        courses,
      };
    });

    const totalPages = Math.ceil(totalRecords / limit) || 1;

    return NextResponse.json(
      serialize({
        registrations,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }),
    );
  } catch (error) {
    console.error("Error listing registrations:", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}
