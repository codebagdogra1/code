import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, ADDRESS, whatsappLink } from "@/lib/site";

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
      { href: "/courses", label: "Web development" },
      { href: "/courses", label: "Data & AI" },
      { href: "/courses", label: "Programming" },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { href: "/contact", label: "Admissions" },
      { href: "/contact", label: "FAQ" },
      { href: "/brochure", label: "Fee structure" },
      { href: "/admin", label: "Admin portal" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[var(--edu-secondary)] text-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-bold tracking-tight text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 3 2 8l10 5 8-4v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 11v4c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-lg">CODE</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Industry-focused coding courses with flexible monthly payment plans. Learn the skills
            that build a career — right here in Bagdogra.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/75">
            <li>
              <a href={`tel:${PHONE_TEL}`} className="transition-colors hover:text-white">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-white">
                {EMAIL}
              </a>
            </li>
            <li className="text-white/60">{ADDRESS}</li>
          </ul>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} CODE Coding Institute. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              WhatsApp
            </a>
            <a href={`tel:${PHONE_TEL}`} className="transition-colors hover:text-white">
              Call
            </a>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
