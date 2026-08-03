import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateReceiptNo } from "@/lib/receipts";

// Public: create a registration from the course-registration form.
// Ported from netlify/functions/registrations.js (POST) — same transactional flow:
// upsert student, create registration + course rows, generate monthly installments
// for monthly plans, and record the initial payment.

type StudentData = {
  full_name: string;
  phone_number: string;
  email?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
};

type SelectedCourse = {
  course_id: number;
  payment_plan: string; // "monthly" | "full"
  course_fee: number;
};

type PaymentDetails = {
  total_amount: number;
  admission_fees?: number;
  discount_amount?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_method?: string;
};

export async function POST(req: Request) {
  let body: {
    studentData?: StudentData;
    selectedCourses?: SelectedCourse[];
    paymentDetails?: PaymentDetails;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { studentData, selectedCourses, paymentDetails } = body;
  if (
    !studentData?.full_name ||
    !studentData?.phone_number ||
    !studentData?.date_of_birth ||
    !Array.isArray(selectedCourses) ||
    selectedCourses.length === 0 ||
    !paymentDetails
  ) {
    return NextResponse.json({ error: "Missing required registration data" }, { status: 400 });
  }

  // date_of_birth and address are NOT NULL in the database, so date of birth is required
  // and address falls back to an empty string when omitted.
  const dob = new Date(studentData.date_of_birth);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Upsert student by phone number. phoneNumber isn't a unique key, so we look it up
      // and update-or-create manually rather than using upsert.
      const studentValues = {
        fullName: studentData.full_name,
        email: studentData.email ?? null,
        dateOfBirth: dob,
        address: studentData.address ?? "",
      };
      const existing = await tx.student.findFirst({
        where: { phoneNumber: studentData.phone_number },
        select: { id: true },
      });
      const student = existing
        ? await tx.student.update({ where: { id: existing.id }, data: studentValues })
        : await tx.student.create({
            data: { ...studentValues, phoneNumber: studentData.phone_number },
          });

      const receiptNo = generateReceiptNo();
      const registration = await tx.registration.create({
        data: {
          receiptNo,
          studentId: student.id,
          totalAmount: paymentDetails.total_amount,
          admissionFees: paymentDetails.admission_fees ?? 0,
          discountAmount: paymentDetails.discount_amount ?? 0,
          paidAmount: paymentDetails.paid_amount ?? 0,
          dueAmount: paymentDetails.due_amount ?? 0,
          paymentMethod: paymentDetails.payment_method ?? "Cash",
        },
      });

      for (const selection of selectedCourses) {
        await tx.courseRegistration.create({
          data: {
            registrationId: registration.id,
            courseId: selection.course_id,
            paymentPlan: selection.payment_plan,
            courseFee: selection.course_fee,
          },
        });

        if (selection.payment_plan === "monthly") {
          const course = await tx.course.findUnique({
            where: { id: selection.course_id },
            select: { monthlyInstallments: true },
          });
          const months = course?.monthlyInstallments || 12;
          const installmentAmount = selection.course_fee / months;
          const start = new Date();

          for (let monthNumber = 1; monthNumber <= months; monthNumber++) {
            const dueDate = new Date(start);
            dueDate.setMonth(dueDate.getMonth() + (monthNumber - 1));
            await tx.monthlyInstallment.create({
              data: {
                registrationId: registration.id,
                courseId: selection.course_id,
                monthNumber,
                monthName: `Month ${monthNumber}`,
                dueDate,
                installmentAmount,
                paymentStatus: "PENDING",
              },
            });
          }
        }
      }

      if ((paymentDetails.paid_amount ?? 0) > 0) {
        await tx.paymentHistory.create({
          data: {
            registrationId: registration.id,
            paymentAmount: paymentDetails.paid_amount ?? 0,
            paymentMethod: paymentDetails.payment_method ?? "Cash",
            paymentType: "initial",
            receiptNo,
            notes: "Initial payment during registration",
          },
        });
      }

      return { receiptNo, registrationId: registration.id };
    });

    return NextResponse.json({
      success: true,
      receipt_no: result.receiptNo,
      registration_id: result.registrationId,
      message: "Registration created successfully with monthly tracking",
    });
  } catch (error) {
    console.error("Error creating registration:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: "Server error: " + message }, { status: 500 });
  }
}
