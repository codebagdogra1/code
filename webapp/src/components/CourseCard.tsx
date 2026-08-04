import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { PublicCourse } from "@/lib/courses";

export function CourseCard({ course }: { course: PublicCourse }) {
  const perMonth =
    course.monthlyPrice != null && course.monthlyInstallments > 0
      ? Math.ceil(course.monthlyPrice / course.monthlyInstallments)
      : null;

  return (
    <div className="card flex flex-col p-6 transition-shadow hover:shadow-[var(--shadow-float)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{course.name}</h3>
        {course.duration && (
          <span className="badge shrink-0 bg-[var(--surface-2)] text-[var(--muted)]">
            {course.duration}
          </span>
        )}
      </div>
      <div className="mt-5 flex-1">
        {course.fullPrice != null && (
          <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {formatCurrency(course.fullPrice)}
          </p>
        )}
        {perMonth != null && (
          <p className="mt-1 text-sm text-[var(--muted)]">
            or <span className="font-medium text-[var(--body)]">{formatCurrency(perMonth)}/mo</span>{" "}
            × {course.monthlyInstallments} months
          </p>
        )}
      </div>
      <Link href="/register" className="btn-primary mt-6">
        Enroll
      </Link>
    </div>
  );
}
