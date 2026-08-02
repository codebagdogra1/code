import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import { LogoutButton } from "@/components/LogoutButton";

// Authenticated admin shell. The proxy already blocks unauthenticated access, but we
// read the session here too so we can show the user and fail safe.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4 md:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)] text-white">
            {"</>"}
          </span>
          CODE Admin
        </Link>
        <AdminNav />
        <div className="mt-auto space-y-3 pt-4">
          <p className="px-3 text-xs text-[var(--muted)]">Signed in as {session.username}</p>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 md:hidden">
          <Link href="/admin" className="font-semibold">
            CODE Admin
          </Link>
          <div className="w-28">
            <LogoutButton />
          </div>
        </div>
        <main className="mx-auto max-w-5xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
