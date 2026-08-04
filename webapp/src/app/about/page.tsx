import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About — CODE",
  description: "CODE is a coding institute built to make industry-ready skills affordable.",
};

const VALUES = [
  {
    title: "Skills over certificates",
    desc: "We teach what employers hire for, then prove it with real projects — not just a piece of paper.",
    icon: "◆",
  },
  {
    title: "Affordable by design",
    desc: "Flexible monthly plans mean no one is priced out of learning to code.",
    icon: "₹",
  },
  {
    title: "Small batches",
    desc: "Every student gets attention. Doubts are cleared the same day, not at the end of term.",
    icon: "☆",
  },
  {
    title: "Career-first",
    desc: "From portfolio to interview prep to referrals — we stay with you until you're placed.",
    icon: "▲",
  },
];

const STATS = [
  { value: "2,500+", label: "Students trained" },
  { value: "40+", label: "Courses offered" },
  { value: "25+", label: "Expert instructors" },
  { value: "92%", label: "Placement support" },
];

const INSTRUCTORS = [
  { name: "Rahul Verma", role: "Full-stack & Web", initial: "R" },
  { name: "Sana Kapoor", role: "Data & AI", initial: "S" },
  { name: "Imran Ali", role: "Programming & DSA", initial: "I" },
  { name: "Divya Nair", role: "UI/UX & Design", initial: "D" },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[var(--navy-900)] text-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--gold-400)]">
              About CODE
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
              We make industry-ready coding skills{" "}
              <span className="text-[var(--gold-500)]">affordable</span> for everyone.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-slate-300">
              CODE is a coding institute focused on one thing: turning motivated learners into
              employable developers — with hands-on teaching and payment plans that fit real life.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">Our story</h2>
          <div className="mt-5 space-y-4 text-[var(--body)] leading-relaxed">
            <p>
              CODE started with a simple frustration: great coding education was either too
              expensive or too theoretical. Bright students were being priced out, and those who
              could pay often graduated without ever building anything real.
            </p>
            <p>
              So we built the opposite — a project-first curriculum taught by working
              professionals, paired with monthly payment plans so cost never stands between a
              learner and a career. Every course tracks your progress and every rupee you pay,
              transparently.
            </p>
            <p>
              Today, thousands of students have moved from their first line of code to their first
              developer job through CODE. The mission hasn&apos;t changed: keep it practical, keep
              it affordable, keep it personal.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[var(--navy-900)] text-white">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-4 py-14 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-[var(--gold-500)] sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">What we stand for</h2>
            <p className="mt-3 text-[var(--muted)]">The principles behind every course we run.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="card flex gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--brand)] text-lg text-[var(--accent)]">
                  {v.icon}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)]">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)]">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Instructors */}
        <section className="bg-[var(--surface-2)]/60">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold sm:text-3xl">Meet our instructors</h2>
              <p className="mt-3 text-[var(--muted)]">
                Working professionals who teach what they practise.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {INSTRUCTORS.map((p) => (
                <div key={p.name} className="card flex flex-col items-center p-6 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--brand)] text-xl font-semibold text-[var(--accent)]">
                    {p.initial}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-[var(--foreground)]">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{p.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--navy-900)] text-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-20">
            <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight sm:text-4xl">
              Join the next batch
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Browse our courses and enroll online in minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/courses" className="btn-primary px-6 py-3 text-base">
                Browse courses
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] border border-white/20 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
