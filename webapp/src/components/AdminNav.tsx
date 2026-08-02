"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/courses", label: "Courses" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-[var(--brand)] text-white"
                : "text-[var(--muted)] hover:bg-black/[.03] dark:hover:bg-white/[.05]"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
