import { Prisma } from "@prisma/client";

// Prisma returns Decimal and Date objects that don't JSON-serialize the way the
// client expects. Convert Decimals to numbers and Dates to ISO strings recursively
// so API responses are plain JSON (mirrors the old pg/JSON.stringify behaviour).
export function serialize<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (value instanceof Prisma.Decimal) return value.toNumber() as unknown as T;
  if (value instanceof Date) return value.toISOString() as unknown as T;
  if (Array.isArray(value)) return value.map((v) => serialize(v)) as unknown as T;
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = serialize(v);
    }
    return out as T;
  }
  return value;
}
