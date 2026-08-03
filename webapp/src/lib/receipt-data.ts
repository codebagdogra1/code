// Server-side loaders for the printable receipts (registration + monthly fee
// payment). These run in the receipt server components, which query Postgres
// directly — no client fetch — and hand plain JSON-safe shapes to the view.
import { prisma } from "@/lib/db";
import { serialize } from "@/lib/serialize";

export type RegistrationReceipt = {
  receipt_no: string;
  registration_date: string | null;
  payment_method: string | null;
  payment_status: string;
  total_amount: number;
  admission_fees: number;
  discount_amount: number;
  paid_amount: number;
  due_amount: number;
  student: {
    full_name: string;
    phone_number: string;
    email: string | null;
    address: string | null;
  };
  courses: {
    course_name: string;
    duration: string | null;
    payment_plan: string;
    course_fee: number;
  }[];
};

export async function getRegistrationReceipt(
  receiptNo: string,
): Promise<RegistrationReceipt | null> {
  const reg = await prisma.registration.findUnique({
    where: { receiptNo },
    include: {
      student: true,
      courseRegistrations: { include: { course: { select: { name: true, duration: true } } } },
    },
  });
  if (!reg) return null;

  return serialize({
    receipt_no: reg.receiptNo,
    registration_date: reg.registrationDate,
    payment_method: reg.paymentMethod,
    payment_status: reg.paymentStatus ?? "PAID",
    total_amount: reg.totalAmount,
    admission_fees: reg.admissionFees ?? 0,
    discount_amount: reg.discountAmount ?? 0,
    paid_amount: reg.paidAmount,
    due_amount: reg.dueAmount,
    student: {
      full_name: reg.student?.fullName ?? "—",
      phone_number: reg.student?.phoneNumber ?? "—",
      email: reg.student?.email ?? null,
      address: reg.student?.address ?? null,
    },
    courses: reg.courseRegistrations.map((cr) => ({
      course_name: cr.course?.name ?? "—",
      duration: cr.course?.duration ?? null,
      payment_plan: cr.paymentPlan,
      course_fee: cr.courseFee,
    })),
  }) as unknown as RegistrationReceipt;
}

export type PaymentReceipt = {
  payment_receipt_no: string;
  payment_date: string | null;
  payment_method: string;
  payment_type: string;
  payment_amount: number;
  notes: string | null;
  registration_receipt_no: string;
  student: {
    full_name: string;
    phone_number: string;
    email: string | null;
  };
  // Registration balance as it stands now (after this and any later payments).
  registration: {
    total_amount: number;
    paid_amount: number;
    due_amount: number;
    payment_status: string;
  };
  // The months this payment was applied to (empty for a flat, non-installment payment).
  months: {
    course_name: string;
    month_number: number;
    month_name: string;
    amount_applied: number;
  }[];
};

export async function getPaymentReceipt(paymentNo: string): Promise<PaymentReceipt | null> {
  const payment = await prisma.paymentHistory.findFirst({
    where: { receiptNo: paymentNo },
    include: {
      registration: { include: { student: true } },
      mappings: {
        include: {
          monthlyInstallment: { include: { course: { select: { name: true } } } },
        },
      },
    },
  });
  if (!payment) return null;

  const months = payment.mappings
    .map((m) => ({
      course_name: m.monthlyInstallment?.course?.name ?? "—",
      month_number: m.monthlyInstallment?.monthNumber ?? 0,
      month_name: m.monthlyInstallment?.monthName ?? "—",
      amount_applied: m.amountApplied,
    }))
    .sort((a, b) =>
      a.course_name === b.course_name
        ? a.month_number - b.month_number
        : a.course_name.localeCompare(b.course_name),
    );

  return serialize({
    payment_receipt_no: payment.receiptNo,
    payment_date: payment.paymentDate,
    payment_method: payment.paymentMethod,
    payment_type: payment.paymentType ?? "installment",
    payment_amount: payment.paymentAmount,
    notes: payment.notes,
    registration_receipt_no: payment.registration?.receiptNo ?? "—",
    student: {
      full_name: payment.registration?.student?.fullName ?? "—",
      phone_number: payment.registration?.student?.phoneNumber ?? "—",
      email: payment.registration?.student?.email ?? null,
    },
    registration: {
      total_amount: payment.registration?.totalAmount ?? 0,
      paid_amount: payment.registration?.paidAmount ?? 0,
      due_amount: payment.registration?.dueAmount ?? 0,
      payment_status: payment.registration?.paymentStatus ?? "PAID",
    },
    months,
  }) as unknown as PaymentReceipt;
}
