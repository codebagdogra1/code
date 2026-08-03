"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ro/Icon";

// Numbered file-spine tabs. The active tab reads as a cream file pulled out of the
// steel rail (see `.ro-spine--active`).
export const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", no: "01" },
  { href: "/admin/registrations/new", label: "New entry", icon: "new", no: "02" },
  { href: "/admin/registrations", label: "Registrations", icon: "registrations", no: "03" },
  { href: "/admin/courses", label: "Courses", icon: "courses", no: "04" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/registrations")
    return (
      pathname.startsWith("/admin/registrations") && !pathname.startsWith("/admin/registrations/new")
    );
  return pathname.startsWith(href);
}

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1.5">
      {NAV_LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={isActive(pathname, l.href) ? "page" : undefined}
          className={`ro-spine ${isActive(pathname, l.href) ? "ro-spine--active" : ""}`}
        >
          <span className="ro-spine__no">{l.no}</span>
          <Icon name={l.icon} size={16} />
          <span className="truncate">{l.label}</span>
        </Link>
      ))}
    </nav>
  );
}

// Horizontal, scrollable nav for the mobile top bar (the steel rail is hidden < md).
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1.5 overflow-x-auto px-3 py-2">
      {NAV_LINKS.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className="flex flex-none items-center gap-1.5 rounded border px-2.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-wide"
            style={{
              background: active ? "var(--ro-panel)" : "rgba(0,0,0,0.22)",
              color: active ? "var(--ro-ink)" : "var(--ro-steel-ink)",
              borderColor: active ? "var(--ro-steel-edge)" : "rgba(255,255,255,0.1)",
            }}
          >
            <Icon name={l.icon} size={14} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
