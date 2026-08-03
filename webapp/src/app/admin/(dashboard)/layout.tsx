import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav, MobileMenu } from "@/components/AdminNav";
import { LogoutButton } from "@/components/LogoutButton";
import { Icon } from "@/components/ro/Icon";

// Direction contract for THE RECORDS OFFICE — emitted as a real HTML comment so it
// survives the production build and can be grepped/audited (seed 23faa872).
const DIRECTION_CONTRACT = `<!--
IMPECCABLE DIRECTION CONTRACT — CODE Admin — "The Records Office"
THESIS: A steel records office, not a SaaS dashboard; refuses the sidebar +
  sparkline-stat-card + rounded-2xl template that produced the incumbent "AI slop".
OWN-WORLD: Enamel-on-steel grey-green chrome, file-cream panels; oxide-red /
  ink-blue / stamp-green / ochre colour code; engraved label plates, numbered
  file-spine nav, inked status stamps, punch-card month grid; Archivo labels +
  JetBrains Mono figures; squared corners, hairlines, no soft SaaS shadows.
STORY: One operator reads money truth (collected / outstanding / overdue) at a
  glance, records payments against exact months, and enrols students fast and safely.
FIRST VIEWPORT: "Day register" worktop — four stamped money-plates across the top,
  today's collection job-cards, a red OVERDUE panel; "New registration" top-right.
FORM: The Records Office (grounded #6; seed 23faa872).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
  review, the verdict, and DESIGN.md.
-->`;

// Authenticated admin shell. The proxy already blocks unauthenticated access, but
// we read the session here too so we can show the user and fail safe.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="ro flex min-h-screen">
      <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />

      {/* Steel records-room rail */}
      <aside
        className="hidden w-60 shrink-0 flex-col border-r border-[var(--ro-steel-edge)] px-3 py-4 md:flex"
        style={{
          background:
            "linear-gradient(180deg,var(--ro-steel-hi),var(--ro-steel) 22%,var(--ro-steel-2))",
        }}
      >
        <Link
          href="/admin"
          className="ro-plate mb-6 w-full justify-center py-2"
          aria-label="CODE Records — dashboard"
        >
          <Icon name="stamp" size={15} />
          CODE · RECORDS
        </Link>

        <AdminNav />

        <div className="mt-auto space-y-3 pt-4">
          <div className="flex items-center gap-2 rounded border border-white/10 bg-black/20 px-2.5 py-2">
            <span className="grid h-7 w-7 flex-none place-items-center rounded-sm bg-[var(--ro-steel-hi)] text-[var(--ro-steel-ink)]">
              <Icon name="user" size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--ro-steel-ink-2)]">
                On duty
              </p>
              <p className="ro-mono truncate text-xs text-[var(--ro-steel-ink)]">
                {session.username}
              </p>
            </div>
          </div>
          <LogoutButton full />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile steel top bar + hamburger drawer (the rail is hidden < md) */}
        <MobileMenu username={session.username} />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-9">{children}</main>
      </div>
    </div>
  );
}
