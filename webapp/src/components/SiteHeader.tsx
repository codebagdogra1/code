import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)] text-white">
            {"</>"}
          </span>
          <span>CODE</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/brochure" className="btn-ghost">
            Brochure
          </Link>
          <Link href="/register" className="btn-primary">
            Enroll now
          </Link>
          <Link href="/admin" className="btn-ghost">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
