import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-[var(--foreground)]"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand)] font-mono text-sm text-[var(--accent)] shadow-sm">
            {"</>"}
          </span>
          <span className="text-base">CODE</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/brochure" className="btn-ghost">
            Brochure
          </Link>
          <Link href="/register" className="btn-primary">
            Enroll now
          </Link>
          <Link href="/admin" className="btn-ghost hidden sm:inline-flex">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
