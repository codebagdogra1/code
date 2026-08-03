"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ro/Icon";

// Numbered file-spine tabs. The active tab reads as a cream file pulled out of the
// steel rail (see `.ro-spine--active`).
const links = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", no: "01" },
  { href: "/admin/registrations/new", label: "New registration", icon: "new", no: "02" },
  { href: "/admin/registrations", label: "Registrations", icon: "registrations", no: "03" },
  { href: "/admin/courses", label: "Courses", icon: "courses", no: "04" },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1.5">
      {links.map((l) => {
        const active =
          l.href === "/admin"
            ? pathname === "/admin"
            : l.href === "/admin/registrations"
              ? pathname.startsWith("/admin/registrations") &&
                !pathname.startsWith("/admin/registrations/new")
              : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`ro-spine ${active ? "ro-spine--active" : ""}`}
          >
            <span className="ro-spine__no">{l.no}</span>
            <Icon name={l.icon} size={16} />
            <span className="truncate">{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
