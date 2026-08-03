import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { serialize } from "@/lib/serialize";
import { generatePaymentReceiptNo } from "@/lib/receipts";

const D = (v: Prisma.Decimal.Value) => new Prisma.Decimal(v);

type MonthlyPayment = { course_id: number; month_ids: number[]; amount: number };

// Admin: record a payment. Ported from netlify/functions/record-payment.js.
// Supports both a monthly-installment breakdown and a legacy flat payment.
export async function POST(req: Request) {
  let body: {
    registration_receipt_no?: string;
    payment_amount?: number;
    payment_method?: string;
    notes?: string;
    monthly_payments?: MonthlyPayment[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    registration_receipt_no,
    payment_amount,
    payment_method,
    notes = "",
    monthly_payments = [],
  } = body;

  if (!registration_receipt_no || !payment_amount || payment_amount <= 0) {
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }

  try {
    const registration = await prisma.registration.findUnique({
      where: { receiptNo: registration_receipt_no },
      select: { id: true },
    });
    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const paymentReceiptNo = generatePaymentReceiptNo();
    const warnings: string[] = [];

    if (monthly_payments.length > 0) {
      // Validate the breakdown sums to the total and warn about skipped months.
      let totalMonthly = 0;
      for (const mp of monthly_payments) {
        totalMonthly += mp.amount;
        if (mp.month_ids.length === 0) continue;

        const selected = await prisma.monthlyInstallment.findMany({
          where: { registrationId: registration.id, courseId: mp.course_id, id: { in: mp.month_ids } },
          include: { course: { select: { name: true } } },
          orderBy: { monthNumber: "asc" },
        });
        const minMonth = Math.min(...selected.map((s) => s.monthNumber));
        const unpaidPrevious = await prisma.monthlyInstallment.findMany({
          where: {
            registrationId: registration.id,
            courseId: mp.course_id,
            monthNumber: { lt: minMonth },
            paymentStatus: "PENDING",
          },
          orderBy: { monthNumber: "asc" },
        });
        if (unpaidPrevious.length > 0) {
          const courseName = selected[0]?.course?.name || "Unknown Course";
          warnings.push(
            `WARNING: ${courseName} has unpaid previous months: ${unpaidPrevious
              .map((m) => m.monthName)
              .join(", ")}`,
          );
        }
      }

      if (Math.abs(totalMonthly - payment_amount) > 0.01) {
        return NextResponse.json(
          {
            error: `Monthly payment breakdown (₹${totalMonthly}) doesn't match total payment (₹${payment_amount})`,
          },
          { status: 400 },
        );
      }

      await prisma.$transaction(async (tx) => {
        const payment = await tx.paymentHistory.create({
          data: {
            registrationId: registration.id,
            paymentAmount: payment_amount,
            paymentMethod: payment_method ?? "Cash",
            paymentType: "installment",
            receiptNo: paymentReceiptNo,
            notes,
          },
        });

        for (const mp of monthly_payments) {
          const amountPerMonth = mp.amount / mp.month_ids.length;
          for (const monthId of mp.month_ids) {
            const inst = await tx.monthlyInstallment.findUnique({ where: { id: monthId } });
            if (!inst) continue;
            const newPaid = (inst.paidAmount ?? D(0)).add(D(amountPerMonth));
            const isPaid = newPaid.gte(inst.installmentAmount);
            await tx.monthlyInstallment.update({
              where: { id: monthId },
              data: {
                paidAmount: newPaid,
                paymentStatus: isPaid ? "PAID" : "PARTIAL",
                paymentDate: isPaid ? new Date() : inst.paymentDate,
              },
            });
            await tx.paymentInstallmentMapping.create({
              data: {
                paymentHistoryId: payment.id,
                monthlyInstallmentId: monthId,
                amountApplied: amountPerMonth,
              },
            });
          }
        }

        await applyPaymentToRegistration(tx, registration.id, payment_amount);
      });
    } else {
      // Legacy flat payment.
      await prisma.$transaction(async (tx) => {
        await tx.paymentHistory.create({
          data: {
            registrationId: registration.id,
            paymentAmount: payment_amount,
            paymentMethod: payment_method ?? "Cash",
            paymentType: "installment",
            receiptNo: paymentReceiptNo,
            notes,
          },
        });
        await applyPaymentToRegistration(tx, registration.id, payment_amount);
      });
    }

    return NextResponse.json({
      success: true,
      message: `Payment of ₹${payment_amount} recorded successfully`,
      payment_receipt_no: paymentReceiptNo,
      warnings: warnings.length > 0 ? warnings : null,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}

// Admin: quick "add payment" against a registration. Ported from update-payment.js.
export async function PUT(req: Request) {
  let body: { receipt_no?: string; additional_payment?: number; payment_method?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { receipt_no, additional_payment, payment_method } = body;
  if (!receipt_no || !additional_payment || additional_payment <= 0) {
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }

  try {
    const reg = await prisma.registration.findUnique({ where: { receiptNo: receipt_no } });
    if (!reg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (payment_method) {
        await tx.registration.update({
          where: { id: reg.id },
          data: { paymentMethod: payment_method },
        });
      }
      return applyPaymentToRegistration(tx, reg.id, additional_payment);
    });

    return NextResponse.json({
      success: true,
      message: `Payment of ₹${additional_payment} added successfully`,
      registration: serialize(updated),
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}

// Admin: GET payment history or grouped monthly-installment status.
export async function GET(req: NextRequest) {
  const receiptNo = req.nextUrl.searchParams.get("receipt_no");
  const action = req.nextUrl.searchParams.get("action");
  if (!receiptNo) {
    return NextResponse.json({ error: "receipt_no is required" }, { status: 400 });
  }

  try {
    const reg = await prisma.registration.findUnique({
      where: { receiptNo },
      select: { id: true },
    });
    if (!reg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (action === "monthly_installments") {
      const rows = await prisma.monthlyInstallment.findMany({
        where: { registrationId: reg.id },
        include: { course: { select: { name: true, duration: true } } },
        orderBy: [{ course: { name: "asc" } }, { monthNumber: "asc" }],
      });
      const today = new Date();

      const grouped: Record<string, unknown> = {};
      for (const mi of rows) {
        const overdue = mi.dueDate < today && mi.paymentStatus === "PENDING";
        const daysOverdue = overdue
          ? Math.floor((today.getTime() - mi.dueDate.getTime()) / 86_400_000)
          : 0;
        const courseName = mi.course?.name ?? "Unknown Course";
        const courseDuration = mi.course?.duration ?? "";
        const entry = {
          id: mi.id,
          course_id: mi.courseId,
          course_name: courseName,
          duration: courseDuration,
          month_number: mi.monthNumber,
          month_name: mi.monthName,
          due_date: mi.dueDate,
          installment_amount: mi.installmentAmount,
          paid_amount: mi.paidAmount,
          payment_status: mi.paymentStatus,
          payment_date: mi.paymentDate,
          current_status: overdue ? "OVERDUE" : mi.paymentStatus,
          days_overdue: daysOverdue,
        };
        const group = (grouped[courseName] ??= {
          course_id: mi.courseId,
          course_name: courseName,
          duration: courseDuration,
          installments: [],
        }) as { installments: unknown[] };
        group.installments.push(entry);
      }

      return NextResponse.json(serialize({ courses: Object.values(grouped) }));
    }

    const payments = await prisma.paymentHistory.findMany({
      where: { registrationId: reg.id },
      orderBy: { paymentDate: "desc" },
      include: {
        registration: {
          select: { receiptNo: true, student: { select: { fullName: true, phoneNumber: true } } },
        },
      },
    });

    const mapped = payments.map((p) => ({
      id: p.id,
      registration_id: p.registrationId,
      payment_amount: p.paymentAmount,
      payment_method: p.paymentMethod,
      payment_type: p.paymentType,
      receipt_no: p.receiptNo,
      notes: p.notes,
      payment_date: p.paymentDate,
      registration_receipt_no: p.registration?.receiptNo ?? "",
      full_name: p.registration?.student?.fullName ?? "",
      phone_number: p.registration?.student?.phoneNumber ?? "",
    }));

    return NextResponse.json(serialize({ payments: mapped }));
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// Recompute registration paid/due/status after applying `amount`. Mirrors the SQL
// in the old functions: due = max(0, total - discount - paid).
async function applyPaymentToRegistration(
  tx: Prisma.TransactionClient,
  registrationId: number,
  amount: number,
) {
  // Registration money columns (paid/total/discount/due) are integer rupees, so we do
  // plain number math here rather than Decimal arithmetic.
  const reg = await tx.registration.findUniqueOrThrow({ where: { id: registrationId } });
  const newPaid = reg.paidAmount + amount;
  const newDue = Math.max(0, reg.totalAmount - (reg.discountAmount ?? 0) - newPaid);
  return tx.registration.update({
    where: { id: registrationId },
    data: {
      paidAmount: newPaid,
      dueAmount: newDue,
      paymentStatus: newDue <= 0 ? "COMPLETED" : "PARTIAL",
    },
  });
}
