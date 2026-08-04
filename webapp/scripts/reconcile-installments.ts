// Reconcile the "first month (and other admission-time money) never reflected in
// the monthly installments" misconfig. Historically a registration's initial
// payment was written to payment_history but never applied to any installment, so
// month 1 stays PENDING even though it was paid at the desk.
//
// This restores the invariant: the money collected for installments
//   = registration.paid_amount − admission_fees   (capped at the installment total)
// should be reflected across the installments, oldest month first. It never
// applies MORE than that, never touches CANCELLED installments or CANCELLED
// registrations, and flags anything it can't place cleanly for manual review.
//
//   npx tsx scripts/reconcile-installments.ts            # DRY RUN (writes nothing)
//   npx tsx scripts/reconcile-installments.ts --apply    # apply the changes
import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../src/lib/db";

const APPLY = process.argv.includes("--apply");
const EPS = 1; // ignore sub-rupee / rounding-noise gaps

type Plan = {
  receiptNo: string;
  name: string;
  admission: number;
  regPaid: number;
  target: number;
  currentInstPaid: number;
  shortfall: number;
  leftover: number; // money that can't land on any installment (full course / overpay)
  updates: { id: number; monthNumber: number; newPaid: number; fullyPaid: boolean; applied: number }[];
  mappable: number; // unmapped payment_history amount available to attach mappings to
};

async function main() {
  const regs = await prisma.registration.findMany({
    include: {
      student: { select: { fullName: true } },
      paymentHistory: { include: { mappings: { select: { amountApplied: true } } } },
      monthlyInstallments: { orderBy: { monthNumber: "asc" } },
    },
  });

  const plans: Plan[] = [];

  for (const r of regs) {
    if ((r.paymentStatus ?? "").toUpperCase() === "CANCELLED") continue;
    const insts = r.monthlyInstallments.filter(
      (m) => (m.paymentStatus ?? "").toUpperCase() !== "CANCELLED",
    );
    if (insts.length === 0) continue;

    const admission = Number(r.admissionFees ?? 0);
    const regPaid = Number(r.paidAmount);
    const sumInstAmounts = insts.reduce((s, m) => s + Number(m.installmentAmount), 0);
    const currentInstPaid = insts.reduce((s, m) => s + Number(m.paidAmount ?? 0), 0);

    const installmentMoney = Math.max(0, regPaid - admission);
    const target = Math.min(installmentMoney, sumInstAmounts);
    const shortfall = target - currentInstPaid;
    const leftover = installmentMoney - sumInstAmounts; // >0 means money beyond all installments

    if (shortfall <= EPS) continue; // already consistent (or over-applied — leave alone)

    // Distribute the shortfall oldest-first, filling each month up to its amount.
    let toApply = shortfall;
    const updates: Plan["updates"] = [];
    for (const m of insts) {
      if (toApply <= EPS) break;
      const amt = Number(m.installmentAmount);
      const paid = Number(m.paidAmount ?? 0);
      const room = amt - paid;
      if (room <= EPS) continue;
      const add = Math.min(room, toApply);
      const newPaid = paid + add;
      updates.push({
        id: m.id,
        monthNumber: m.monthNumber,
        newPaid,
        fullyPaid: newPaid >= amt - EPS,
        applied: add,
      });
      toApply -= add;
    }

    const mappable = r.paymentHistory.reduce(
      (s, p) =>
        s + (Number(p.paymentAmount) - p.mappings.reduce((a, m) => a + Number(m.amountApplied), 0)),
      0,
    );

    plans.push({
      receiptNo: r.receiptNo,
      name: r.student?.fullName ?? "?",
      admission,
      regPaid,
      target,
      currentInstPaid,
      shortfall,
      leftover: Math.max(0, leftover),
      updates,
      mappable,
    });
  }

  // ---- Report ----
  console.log(`Mode: ${APPLY ? "APPLY (writing changes)" : "DRY RUN (no writes)"}`);
  console.log(`Registrations needing reconciliation: ${plans.length}\n`);
  for (const p of plans) {
    const flags: string[] = [];
    if (p.leftover > EPS) flags.push(`leftover ₹${p.leftover.toFixed(0)} not placed (full-course/overpay)`);
    if (p.mappable + EPS < p.shortfall)
      flags.push(`only ₹${p.mappable.toFixed(0)} of ₹${p.shortfall.toFixed(0)} is mappable to a payment row`);
    console.log(
      `${p.receiptNo} · ${p.name}\n` +
        `   paid=₹${p.regPaid} admission=₹${p.admission} → target instPaid=₹${p.target.toFixed(0)} ` +
        `(was ₹${p.currentInstPaid.toFixed(0)}), applying ₹${p.shortfall.toFixed(0)}`,
    );
    for (const u of p.updates)
      console.log(`     M${u.monthNumber}: +₹${u.applied.toFixed(0)} → ₹${u.newPaid.toFixed(0)} ${u.fullyPaid ? "[PAID]" : "[PARTIAL]"}`);
    for (const f of flags) console.log(`     ⚠ ${f}`);
  }

  if (!APPLY) {
    console.log(`\nDry run only. Re-run with --apply to write these changes.`);
    return;
  }

  // ---- Apply ----
  let done = 0;
  for (const p of plans) {
    await prisma.$transaction(async (tx) => {
      // Unmapped payment_history rows (oldest first) to attach the new mappings to.
      const payments = await tx.paymentHistory.findMany({
        where: { registration: { receiptNo: p.receiptNo } },
        include: { mappings: { select: { amountApplied: true } } },
        orderBy: { paymentDate: "asc" },
      });
      const pool = payments.map((pay) => ({
        id: pay.id,
        remaining:
          Number(pay.paymentAmount) - pay.mappings.reduce((a, m) => a + Number(m.amountApplied), 0),
      }));

      for (const u of p.updates) {
        await tx.monthlyInstallment.update({
          where: { id: u.id },
          data: {
            paidAmount: new Prisma.Decimal(u.newPaid),
            paymentStatus: u.fullyPaid ? "PAID" : "PARTIAL",
            paymentDate: u.fullyPaid ? new Date() : undefined,
          },
        });
        // Attach a mapping, consuming unmapped payment remainder oldest-first.
        let remain = u.applied;
        for (const slot of pool) {
          if (remain <= EPS) break;
          if (slot.remaining <= EPS) continue;
          const take = Math.min(slot.remaining, remain);
          await tx.paymentInstallmentMapping.create({
            data: {
              paymentHistoryId: slot.id,
              monthlyInstallmentId: u.id,
              amountApplied: new Prisma.Decimal(take),
            },
          });
          slot.remaining -= take;
          remain -= take;
        }
      }
    });
    done++;
  }
  console.log(`\n✓ Applied reconciliation to ${done} registration(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
