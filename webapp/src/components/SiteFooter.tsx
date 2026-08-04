import Link from "next/link";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "About CODE",
    links: [
      { href: "/about", label: "Who we are" },
      { href: "/about", label: "Our instructors" },
      { href: "/brochure", label: "Brochure" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Courses",
    links: [
      { href: "/courses", label: "All courses" },
      { href: "/register", label: "Enroll now" },
      { href: "/courses", label: "Web development" },
      { href: "/courses", label: "Data & AI" },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { href: "/contact", label: "Admissions" },
      { href: "/contact", label: "FAQ" },
      { href: "/admin", label: "Admin portal" },
      { href: "/brochure", label: "Fee structure" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 font-semibold tracking-tight text-[var(--foreground)]">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand)] font-mono text-sm text-[var(--accent)]">
              {"</>"}
            </span>
            <span className="text-base">CODE</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-[var(--muted)]">
            Industry-focused coding courses with flexible monthly payment plans. Learn the
            skills that build a career.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-[var(--muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} CODE. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/about" className="transition-colors hover:text-[var(--foreground)]">
              About
            </Link>
            <Link href="/courses" className="transition-colors hover:text-[var(--foreground)]">
              Courses
            </Link>
            <Link href="/contact" className="transition-colors hover:text-[var(--foreground)]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
