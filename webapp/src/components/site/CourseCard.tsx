import Link from "next/link";
import type { PublicCourse } from "@/lib/content";
import { formatRupees } from "@/lib/format";

const TRACK_STYLE: Record<PublicCourse["content"]["track"], string> = {
  "Computer Applications": "bg-[var(--s-sky)] text-[var(--s-ink-2)]",
  "Web Design": "bg-[var(--s-mint)] text-[var(--s-mint-ink)]",
  Ecommerce: "bg-[var(--s-amber)] text-[var(--s-amber-ink)]",
  "Digital Marketing": "bg-[var(--s-accent-tint)] text-[var(--s-accent-2)]",
  AI: "bg-[#ece6ff] text-[#4c2fa3]",
};

export function CourseCard({ course, index }: { course: PublicCourse; index: number }) {
  const c = course.content;
  return (
    <Link
      href={`/courses/${c.slug}`}
      className="s-card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--s-shadow)]"
    >
      <div className="flex items-center justify-between">
        <span className="s-mono text-xs text-[var(--s-muted)]">{String(index + 1).padStart(2, "0")}</span>
        <span className={`s-chip ${TRACK_STYLE[c.track]}`}>{c.track}</span>
      </div>

      <h3 className="mt-4 text-xl leading-snug group-hover:text-[var(--s-accent)]">{c.displayName}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--s-body)]">{c.summary}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--s-line)] pt-4 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Duration</dt>
          <dd className="mt-0.5 font-semibold text-[var(--s-ink)]">{course.duration ?? "Ask us"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--s-muted)]">Level</dt>
          <dd className="mt-0.5 font-semibold text-[var(--s-ink)]">{c.level}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-end justify-between">
        <div>
          {course.perMonth != null ? (
            <>
              <p className="s-display text-2xl font-bold text-[var(--s-ink)]">
                {formatRupees(course.perMonth)}
                <span className="text-sm font-medium text-[var(--s-muted)]">/month</span>
              </p>
              {course.fullPrice != null && (
                <p className="text-xs text-[var(--s-muted)]">or {formatRupees(course.fullPrice)} full payment</p>
              )}
            </>
          ) : course.fullPrice != null ? (
            <p className="s-display text-2xl font-bold text-[var(--s-ink)]">{formatRupees(course.fullPrice)}</p>
          ) : (
            <p className="font-semibold text-[var(--s-ink)]">Ask for fees</p>
          )}
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--s-ink)] text-white transition-colors group-hover:bg-[var(--s-accent)]" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
