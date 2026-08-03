"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ro/Icon";
import { LogoutButton } from "@/components/LogoutButton";

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

// The whole mobile top bar: engraved logo + a hamburger that reveals the file-spine
// nav (and who's on duty + sign-out) in a drawer. The steel rail is hidden < md.
export function MobileMenu({ username }: { username: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-[var(--ro-steel-edge)] md:hidden"
      style={{ background: "linear-gradient(180deg,var(--ro-steel-hi),var(--ro-steel-2))" }}
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        <Link href="/admin" className="ro-plate py-1.5" onClick={() => setOpen(false)}>
          <Icon name="stamp" size={13} />
          CODE · RECORDS
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="ro-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="ro-btn ro-btn--ghost px-2 py-1.5"
        >
          <Icon name={open ? "x" : "menu"} size={18} />
        </button>
      </div>

      {open && (
        <div id="ro-mobile-nav" className="px-3 pb-3">
          <nav className="space-y-1.5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`ro-spine ${isActive(pathname, l.href) ? "ro-spine--active" : ""}`}
              >
                <span className="ro-spine__no">{l.no}</span>
                <Icon name={l.icon} size={16} />
                <span className="truncate">{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-sm bg-[var(--ro-steel-hi)] text-[var(--ro-steel-ink)]">
                <Icon name="user" size={15} />
              </span>
              <p className="ro-mono truncate text-xs text-[var(--ro-steel-ink)]">{username}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
