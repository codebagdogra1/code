import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/PublicLayout";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "About — CODE",
  description: "CODE is a coding institute built to make industry-ready skills affordable.",
};

const VALUES = [
  {
    title: "Skills over certificates",
    desc: "We teach what employers hire for, then prove it with real projects — not just a piece of paper.",
    icon: (
      <path d="M4 5h16M4 12h10M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
  },
  {
    title: "Affordable by design",
    desc: "Flexible monthly plans mean no one is priced out of learning to code.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9 9h4.5a2 2 0 010 4H9m0 0h6M12 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Small batches",
    desc: "Every student gets attention. Doubts are cleared the same day, not at the end of term.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M3 20a6 6 0 0112 0M16 5a3 3 0 010 6M21 20a6 6 0 00-4-5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Career-first",
    desc: "From portfolio to interview prep to referrals — we stay with you until you're placed.",
    icon: (
      <>
        <path d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5L12 21.5 7.1 18.2l.9-5.5-4-3.9L9.5 8 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
  },
];

const STATS = [
  { value: "2,500+", label: "Students trained" },
  { value: "40+", label: "Courses offered" },
  { value: "25+", label: "Expert instructors" },
  { value: "92%", label: "Placement support" },
];

const INSTRUCTORS = [
  { name: "Rahul Verma", role: "Full-stack & Web", avatar: "/edusmart/avatar-1.png" },
  { name: "Sana Kapoor", role: "Data & AI", avatar: "/edusmart/avatar-2.png" },
  { name: "Imran Ali", role: "Programming & DSA", avatar: "/edusmart/avatar-3.png" },
  { name: "Divya Nair", role: "UI/UX & Design", avatar: "/edusmart/avatar-4.png" },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--edu-tint)] to-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="edu-eyebrow mx-auto w-fit">About CODE</span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            We make industry-ready coding skills{" "}
            <span className="text-[var(--edu-primary)]">affordable</span> for everyone.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--body)]">
            CODE is a coding institute focused on one thing: turning motivated learners into
            employable developers — with hands-on teaching and payment plans that fit real life.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 translate-x-5 translate-y-5 rounded-[2rem] bg-[var(--edu-primary)]/10"
            />
            <Image
              src="/edusmart/feature-edu.jpg"
              alt="A CODE classroom session"
              width={640}
              height={480}
              className="w-full rounded-[2rem] object-cover shadow-[var(--shadow-float)]"
            />
          </div>
          <div>
            <span className="edu-eyebrow">Our story</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Built for real learners</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-[var(--body)]">
              <p>
                CODE started with a simple frustration: great coding education was either too
                expensive or too theoretical. Bright students were being priced out, and those who
                could pay often graduated without ever building anything real.
              </p>
              <p>
                So we built the opposite — a project-first curriculum taught by working
                professionals, paired with monthly payment plans so cost never stands between a
                learner and a career. Every course tracks your progress and every rupee you pay.
              </p>
              <p>
                Today, thousands of students have moved from their first line of code to their first
                developer job through CODE. The mission hasn&apos;t changed: keep it practical, keep
                it affordable, keep it personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[var(--edu-secondary)] text-white">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-4 py-14 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="edu-eyebrow">Our values</span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">What we stand for</h2>
          <p className="mt-3 text-[var(--body)]">The principles behind every course we run.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="edu-card flex gap-5 p-7">
              <span className="edu-chip h-12 w-12 shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  {v.icon}
                </svg>
              </span>
              <div>
                <h3 className="text-base font-bold text-[var(--edu-ink)]">{v.title}</h3>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section className="bg-[var(--edu-tint)]/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="edu-eyebrow">Our team</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Meet our instructors</h2>
            <p className="mt-3 text-[var(--body)]">Working professionals who teach what they practise.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INSTRUCTORS.map((p) => (
              <div key={p.name} className="edu-card flex flex-col items-center p-7 text-center">
                <Image
                  src={p.avatar}
                  alt=""
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-[var(--edu-tint)]"
                />
                <h3 className="mt-5 text-base font-bold text-[var(--edu-ink)]">{p.name}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--edu-primary)] px-6 py-16 text-center text-white sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Join the next batch
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Browse our courses or message us on WhatsApp to get started.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/courses" className="edu-btn !bg-white !text-[var(--edu-primary)] hover:!bg-white/90 px-8 py-3.5 text-base">
              Browse courses
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-btn-ghost px-8 py-3.5 text-base"
            >
              Enroll on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
