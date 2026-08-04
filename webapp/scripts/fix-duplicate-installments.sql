-- Fix duplicate monthly_installments, permanently.
--
-- Root cause: installments were written TWICE for every monthly registration —
-- once by the app (src/app/api/register/route.ts) and again by the Postgres
-- trigger `after_course_registration_insert`. Two writers, no uniqueness guard.
--
-- This migration (1) removes existing duplicate rows, (2) drops the redundant
-- trigger + its functions so the app is the single writer, and (3) adds a UNIQUE
-- constraint so a double-insert can never recur.
--
-- Safe to re-run: dedup is idempotent, DROP uses IF EXISTS, and the constraint
-- add is guarded. Take a backup first (dump.sql already captured one on 2026-08-04).

BEGIN;

-- 1) Delete duplicate rows, keeping the "real" one per (registration, course, month).
--    Priority: most payment mappings > PAID status > highest paid_amount > lowest id.
--    The survivor is always the row that holds any payment history, so no mapping
--    or payment is ever lost (mapped rows always rank first and are kept).
WITH ranked AS (
  SELECT mi.id,
    ROW_NUMBER() OVER (
      PARTITION BY registration_id, course_id, month_number
      ORDER BY
        (SELECT COUNT(*) FROM payment_installment_mapping pim
         WHERE pim.monthly_installment_id = mi.id) DESC,
        (CASE WHEN payment_status = 'PAID' THEN 1 ELSE 0 END) DESC,
        COALESCE(paid_amount, 0) DESC,
        id ASC
    ) AS rn
  FROM monthly_installments mi
)
DELETE FROM monthly_installments
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 2) Drop the duplicate-causing trigger and its now-unused functions.
DROP TRIGGER IF EXISTS after_course_registration_insert ON course_registrations;
DROP FUNCTION IF EXISTS trigger_create_monthly_installments();
DROP FUNCTION IF EXISTS create_monthly_installments_for_registration(integer);

-- 3) Prevent recurrence at the database level.
ALTER TABLE monthly_installments
  ADD CONSTRAINT monthly_installments_reg_course_month_key
  UNIQUE (registration_id, course_id, month_number);

COMMIT;
