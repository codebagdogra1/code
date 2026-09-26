import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Admin sign in | CODE",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.userType === "admin") redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_#dce8ed,_#f8fafc_48%,_#e8edf1)] px-5 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="border-b border-slate-200 bg-[#0e3f65] px-7 py-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">CODE</p>
          <h1 className="mt-2 text-2xl font-bold">Records Office</h1>
          <p className="mt-1 text-sm text-sky-100">Sign in to manage student records and payments.</p>
        </div>
        <div className="px-7 py-7">
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
