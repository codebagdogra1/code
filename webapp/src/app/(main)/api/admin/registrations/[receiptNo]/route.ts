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
        // The student, plus every registration they hold — used to render the
        // "student files" strip so the desk can hop between a student's separate
        // registrations (e.g. a DCA→ADCA transfer that lives on two receipts).
        student: {
          include: {
            registrations: {
              include: { courseRegistrations: { include: { course: { select: { name: true } } } } },
              orderBy: { registrationDate: "asc" },
            },
          },
        },
        courseRegistrations: { include: { course: true } },
        monthlyInstallments: { include: { course: true }, orderBy: { monthNumber: "asc" } },
      },
    });

    if (!reg || !reg.student) {
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
      student_id: reg.studentId,
      // The student's registrations (including this one), for the files strip.
      student_registrations: reg.student.registrations.map((r) => ({
        receipt_no: r.receiptNo,
        registration_date: r.registrationDate,
        payment_status: r.paymentStatus,
        due_amount: r.dueAmount,
        course_names: r.courseRegistrations
          .map((cr) => cr.course?.name ?? "")
          .filter(Boolean),
      })),
      courses: reg.courseRegistrations.map((cr) => ({
        course_id: cr.courseId,
        course_name: cr.course?.name ?? "",
        payment_plan: cr.paymentPlan,
        course_fee: cr.courseFee,
        duration: cr.course?.duration ?? "",
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
        course_name: mi.course?.name ?? "",
      })),
    };

    return NextResponse.json(serialize(response));
  } catch (error) {
    console.error("Error fetching registration:", error);
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 });
  }
}

// Admin: change a registration's enrolment status. Used when a student leaves
// midway or cancels: we mark the registration CANCELLED and park its still-unpaid
// installments so they stop accruing overdue months (recorded payments are kept).
// ACTIVE restores those installments and recomputes the money status.
//
// When a `course_id` is supplied the action is scoped to that one course: only its
// pending months are parked/restored and the registration itself stays active. This
// is how a student who switches one course (of several) midway has just that course
// written off, leaving the rest of the registration untouched.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ receiptNo: string }> },
) {
  const { receiptNo } = await params;

  let body: { status?: string; course_id?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const target = (body.status || "").toUpperCase();
  if (target !== "CANCELLED" && target !== "ACTIVE") {
    return NextResponse.json({ error: "status must be CANCELLED or ACTIVE" }, { status: 400 });
  }

  // Optional course scope: park/restore just this course's months.
  const courseId = body.course_id != null ? Number(body.course_id) : null;
  if (body.course_id != null && !Number.isInteger(courseId)) {
    return NextResponse.json({ error: "course_id must be an integer" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.findUnique({
        where: { receiptNo },
        select: { id: true, paidAmount: true, dueAmount: true },
      });
      if (!reg) return null;

      // Course-scoped write-off / restore: touch only that course's months and
      // leave the registration status alone (other courses may still be active).
      if (courseId != null) {
        const enrolled = await tx.courseRegistration.findFirst({
          where: { registrationId: reg.id, courseId },
          select: { id: true },
        });
        if (!enrolled) return { notFoundCourse: true };

        if (target === "CANCELLED") {
          await tx.monthlyInstallment.updateMany({
            where: { registrationId: reg.id, courseId, paymentStatus: "PENDING" },
            data: { paymentStatus: "CANCELLED" },
          });
        } else {
          await tx.monthlyInstallment.updateMany({
            where: { registrationId: reg.id, courseId, paymentStatus: "CANCELLED" },
            data: { paymentStatus: "PENDING" },
          });
        }
        return { status: target, courseId };
      }

      if (target === "CANCELLED") {
        await tx.monthlyInstallment.updateMany({
          where: { registrationId: reg.id, paymentStatus: "PENDING" },
          data: { paymentStatus: "CANCELLED" },
        });
        await tx.registration.update({
          where: { id: reg.id },
          data: { paymentStatus: "CANCELLED" },
        });
      } else {
        await tx.monthlyInstallment.updateMany({
          where: { registrationId: reg.id, paymentStatus: "CANCELLED" },
          data: { paymentStatus: "PENDING" },
        });
        const status = reg.dueAmount <= 0 ? "PAID" : reg.paidAmount > 0 ? "PARTIAL" : "PENDING";
        await tx.registration.update({
          where: { id: reg.id },
          data: { paymentStatus: status },
        });
      }

      return { status: target };
    });

    if (!result) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }
    if ("notFoundCourse" in result) {
      return NextResponse.json({ error: "Course not found on this registration" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status: result.status });
  } catch (error) {
    console.error("Error updating registration status:", error);
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
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

      let deletedStudent = false;
      if (reg.studentId != null) {
        const remaining = await tx.registration.count({ where: { studentId: reg.studentId } });
        if (remaining === 0) {
          await tx.student.delete({ where: { id: reg.studentId } });
          deletedStudent = true;
        }
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
