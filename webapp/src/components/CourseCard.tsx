import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { courseThumb, type PublicCourse } from "@/lib/courses";
import { whatsappLink } from "@/lib/site";

export function CourseCard({ course }: { course: PublicCourse }) {
  const perMonth =
    course.monthlyPrice != null && course.monthlyInstallments > 0
      ? Math.ceil(course.monthlyPrice / course.monthlyInstallments)
      : null;

  return (
    <div className="edu-card group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]">
      <div className="relative aspect-[5/3] overflow-hidden">
        <Image
          src={courseThumb(course.id)}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {course.duration && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[var(--edu-primary)] shadow-sm">
            {course.duration}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div aria-hidden className="flex items-center gap-1 text-sm text-[var(--edu-star)]">
          ★★★★★
          <span className="ml-1 text-xs font-medium text-[var(--muted)]">(4.9)</span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-[var(--edu-ink)]">{course.name}</h3>

        <div className="mt-4 flex-1">
          {course.fullPrice != null && (
            <p className="text-2xl font-extrabold tracking-tight text-[var(--edu-ink)]">
              {formatCurrency(course.fullPrice)}
            </p>
          )}
          {perMonth != null && (
            <p className="mt-1 text-sm text-[var(--muted)]">
              or{" "}
              <span className="font-semibold text-[var(--edu-primary)]">
                {formatCurrency(perMonth)}/mo
              </span>{" "}
              × {course.monthlyInstallments} months
            </p>
          )}
        </div>

        <a
          href={whatsappLink(course.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="edu-btn mt-6 w-full"
        >
          Enroll now
        </a>
      </div>
    </div>
  );
}
