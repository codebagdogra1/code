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
    <a
      href={whatsappLink(course.name)}
      target="_blank"
      rel="noopener noreferrer"
      className="edu-card group flex flex-col overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-[var(--shadow-float)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={courseThumb(course.id)}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          aria-hidden
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[var(--edu-primary)] shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div aria-hidden className="flex items-center gap-1 text-sm text-[var(--edu-star)]">
          ★★★★★
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-[var(--edu-ink)] transition-colors group-hover:text-[var(--edu-primary)]">
          {course.name}
        </h3>
        <p className="mt-1.5 text-sm text-[var(--muted)]">by CODE</p>

        <div className="mt-3">
          {course.fullPrice != null ? (
            <p className="text-xl font-extrabold tracking-tight text-[var(--edu-ink)]">
              {formatCurrency(course.fullPrice)}
              {perMonth != null && (
                <span className="ml-2 text-sm font-semibold text-[var(--edu-price)]">
                  or {formatCurrency(perMonth)}/mo
                </span>
              )}
            </p>
          ) : (
            <p className="text-lg font-extrabold text-[var(--edu-price)]">Ask on WhatsApp</p>
          )}
        </div>

        {/* Meta footer — duration + installment plan, mirroring EduSmart's
            lessons/students row. */}
        <div className="mt-auto flex items-center gap-5 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
          {course.duration && (
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
              {course.duration}
            </span>
          )}
          {course.monthlyInstallments > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              {course.monthlyInstallments}-month plan
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
