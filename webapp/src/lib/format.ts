export function formatCurrency(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// Returns the classes for a status badge. Always combine with `badge badge-dot`
// so status carries a coloured dot + text label, never colour alone (WCAG).
// Money semantics: paid = success, outstanding/partial = warning, overdue = danger.
export function statusColor(status: string | null | undefined): string {
  switch ((status || "").toUpperCase()) {
    case "COMPLETED":
    case "PAID":
      return "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300";
    case "PARTIAL":
    case "PENDING":
    case "DUE":
      return "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300";
    case "OVERDUE":
    case "ERROR":
      return "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300";
  }
}
