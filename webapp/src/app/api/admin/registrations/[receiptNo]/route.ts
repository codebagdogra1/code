import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serialize } from "@/lib/serialize";

// Admin: single registration with student, courses and monthly installments.
// Ported from netlify/functions/registrations.js (GET detail).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ receiptNo: string }> },
) {
  const { receiptNo } = await params;
  try {
    const reg = await prisma.registration.findUnique({
      where: { receiptNo },
      include: {
        student: true,
        courseRegistrations: { include: { course: true } },
        monthlyInstallments: { include: { course: true }, orderBy: { monthNumber: "asc" } },
      },
    });

    if (!reg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const response = {
      id: reg.id,
      receipt_no: reg.receiptNo,
      registration_date: reg.registrationDate,
      total_amount: reg.totalAmount,
      admission_fees: reg.admissionFees,
      discount_amount: reg.discountAmount,
      paid_amount: reg.paidAmount,
      due_amount: reg.dueAmount,
      payment_method: reg.paymentMethod,
      payment_status: reg.paymentStatus,
      full_name: reg.student.fullName,
      phone_number: reg.student.phoneNumber,
      email: reg.student.email,
      address: reg.student.address,
      date_of_birth: reg.student.dateOfBirth,
      courses: reg.courseRegistrations.map((cr) => ({
        course_name: cr.course.name,
        payment_plan: cr.paymentPlan,
        course_fee: cr.courseFee,
        duration: cr.course.duration,
      })),
      monthly_installments: reg.monthlyInstallments.map((mi) => ({
        id: mi.id,
        month_number: mi.monthNumber,
        month_name: mi.monthName,
        due_date: mi.dueDate,
        installment_amount: mi.installmentAmount,
        paid_amount: mi.paidAmount,
        payment_status: mi.paymentStatus,
        payment_date: mi.paymentDate,
        course_name: mi.course.name,
      })),
    };

    return NextResponse.json(serialize(response));
  } catch (error) {
    console.error("Error fetching registration:", error);
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 });
  }
}

// Admin: delete a registration and all related rows in FK-safe order, removing the
// student too if they have no other registrations. Ported from delete-registration.js.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ receiptNo: string }> },
) {
  const { receiptNo } = await params;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.findUnique({
        where: { receiptNo },
        select: { id: true, receiptNo: true, studentId: true },
      });
      if (!reg) return null;

      await tx.paymentInstallmentMapping.deleteMany({
        where: { monthlyInstallment: { registrationId: reg.id } },
      });
      await tx.paymentHistory.deleteMany({ where: { registrationId: reg.id } });
      await tx.monthlyInstallment.deleteMany({ where: { registrationId: reg.id } });
      await tx.courseRegistration.deleteMany({ where: { registrationId: reg.id } });
      await tx.registration.delete({ where: { id: reg.id } });

      const remaining = await tx.registration.count({ where: { studentId: reg.studentId } });
      let deletedStudent = false;
      if (remaining === 0) {
        await tx.student.delete({ where: { id: reg.studentId } });
        deletedStudent = true;
      }

      return { receiptNo: reg.receiptNo, deletedStudent };
    });

    if (!result) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${result.receiptNo} and all related data deleted successfully`,
      deleted_student: result.deletedStudent,
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 });
  }
}
