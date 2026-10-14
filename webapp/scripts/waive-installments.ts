// Standalone scripts do not get Next.js's automatic `.env` loading.
import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../src/lib/db";

// Correct a monthly-plan concession by turning its earliest unpaid months into
// free, settled months. This never deletes payment history and refuses to touch
// a month that already has money recorded against it.
//
// Usage:
//   npm run waive-installments -- CODE-2026-676871 ADCA 3
const [receiptNo, courseName, countArgument] = process.argv.slice(2);
const freeMonths = Number(countArgument);

if (!receiptNo || !courseName || !Number.isInteger(freeMonths) || freeMonths < 1) {
  throw new Error(
    "Usage: npm run waive-installments -- <registration-id> <course-name> <number-of-free-months>",
  );
}

async function main() {
  const result = await prisma.$transaction(async (tx) => {
    const registration = await tx.registration.findUnique({
      where: { receiptNo },
      select: { id: true, totalAmount: true, discountAmount: true, paidAmount: true },
    });
    if (!registration) throw new Error(`Registration ${receiptNo} was not found.`);

    const courseRegistration = await tx.courseRegistration.findFirst({
      where: { registrationId: registration.id, course: { name: courseName } },
      select: { courseId: true },
    });
    if (courseRegistration?.courseId == null) {
      throw new Error(`${courseName} is not a monthly course on ${receiptNo}.`);
    }

    const allInstallments = await tx.monthlyInstallment.findMany({
      where: { registrationId: registration.id, courseId: courseRegistration.courseId },
      orderBy: { monthNumber: "asc" },
      select: { id: true, monthNumber: true, installmentAmount: true, paidAmount: true },
    });
    const installments = allInstallments.slice(0, freeMonths);
    if (installments.length !== freeMonths) {
      throw new Error(`Expected ${freeMonths} installments but found ${installments.length}.`);
    }
    if (installments.some((month) => new Prisma.Decimal(month.paidAmount ?? 0).gt(0))) {
      throw new Error("A selected month has a recorded payment and cannot be converted to a waiver.");
    }

    const selectedAmount = installments.reduce(
      (sum, month) => sum.plus(month.installmentAmount),
      new Prisma.Decimal(0),
    );
    // Older records may already store free months as ₹0 but leave their status
    // pending. In that case validate the concession against a later normal month.
    const normalMonthlyAmount = allInstallments.find((month) =>
      new Prisma.Decimal(month.installmentAmount).gt(0),
    )?.installmentAmount;
    const waivedAmount = selectedAmount.eq(0) && normalMonthlyAmount != null
      ? new Prisma.Decimal(normalMonthlyAmount).mul(freeMonths)
      : selectedAmount;
    if (!waivedAmount.eq(registration.discountAmount ?? 0)) {
      throw new Error(
        `The selected months total ₹${waivedAmount}, but the registration discount is ₹${registration.discountAmount ?? 0}.`,
      );
    }

    await tx.monthlyInstallment.updateMany({
      where: { id: { in: installments.map((month) => month.id) } },
      data: { installmentAmount: 0, paidAmount: 0, paymentStatus: "PAID", paymentDate: null },
    });

    const dueAmount = Math.max(
      0,
      registration.totalAmount - (registration.discountAmount ?? 0) - registration.paidAmount,
    );
    await tx.registration.update({
      where: { id: registration.id },
      data: {
        dueAmount,
        paymentStatus: dueAmount === 0 ? "COMPLETED" : registration.paidAmount > 0 ? "PARTIAL" : "PENDING",
      },
    });

    return { waivedAmount: waivedAmount.toNumber(), dueAmount };
  });

  console.log(
    `${receiptNo}: waived the first ${freeMonths} ${courseName} month(s) (₹${result.waivedAmount}); balance due ₹${result.dueAmount}.`,
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
