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
          _count: {
            select: {
              monthlyInstallments: {
                where: { paymentStatus: "PENDING", dueDate: { lt: now } },
              },
            },
          },
        },
      }),
      prisma.registration.count(),
    ]);

    const registrations = rows.map((r) => ({
      id: r.id,
      receipt_no: r.receiptNo,
      registration_date: r.registrationDate,
      total_amount: r.totalAmount,
      admission_fees: r.admissionFees,
      paid_amount: r.paidAmount,
      due_amount: r.dueAmount,
      payment_method: r.paymentMethod,
      payment_status: r.paymentStatus,
      full_name: r.student?.fullName ?? "",
      phone_number: r.student?.phoneNumber ?? "",
      email: r.student?.email ?? null,
      overdue_months: r._count.monthlyInstallments,
    }));

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
