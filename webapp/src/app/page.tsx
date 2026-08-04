import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CourseCard } from "@/components/CourseCard";
import { Faq } from "@/components/Faq";
import { getActiveCourses } from "@/lib/courses";

// Server component: fetch active courses directly from the DB (no API round-trip).
// Courses change rarely, so serve a prerendered page and revalidate in the
// background every 5 minutes (ISR) instead of hitting the DB on every request.
export const revalidate = 300;

const CATEGORIES = [
  { title: "Web Development", desc: "HTML, CSS, JavaScript, React & full-stack.", icon: "</>" },
  { title: "Data & AI", desc: "Python, data analysis, machine learning.", icon: "◑" },
  { title: "Programming", desc: "C, C++, Java, DSA & problem solving.", icon: "{ }" },
  { title: "Design & Tools", desc: "UI/UX, Git, databases & deployment.", icon: "✦" },
];

const STATS = [
  { value: "2,500+", label: "Students trained" },
  { value: "40+", label: "Courses offered" },
  { value: "25+", label: "Expert instructors" },
  { value: "92%", label: "Placement support" },
];

const FEATURES = [
  {
    title: "Industry-focused syllabus",
    desc: "Courses built around what employers actually hire for — no filler, just skills that ship.",
    icon: "◆",
  },
  {
    title: "Flexible monthly plans",
    desc: "Pay in full or spread the fee across easy monthly installments. Track every payment online.",
    icon: "₹",
  },
  {
    title: "Hands-on projects",
    desc: "Build real applications from day one and graduate with a portfolio, not just a certificate.",
    icon: "▤",
  },
  {
    title: "Mentors, not lecturers",
    desc: "Small batches and working professionals who guide you through every concept and blocker.",
    icon: "☆",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The monthly plan made it possible for me to enroll without a loan. I landed a front-end role three months after finishing.",
    name: "Priya S.",
    role: "Front-end Developer",
  },
  {
    quote:
      "Project-first teaching changed everything. I actually understood what I was building instead of memorising syntax.",
    name: "Arjun M.",
    role: "Full-stack Trainee",
  },
  {
    quote:
      "The instructors treated us like a team. Doubts were cleared the same day and the pace was just right.",
    name: "Neha R.",
    role: "Data Analytics Student",
  },
];

const FAQ = [
  {
    q: "Do I need prior coding experience to enroll?",
    a: "No. Our foundation courses start from the absolute basics. More advanced tracks list any prerequisites on the course details.",
  },
  {
    q: "How do the monthly payment plans work?",
    a: "You can pay the full course fee upfront or split it across monthly installments. After you enroll, every installment and payment is tracked in your record.",
  },
  {
    q: "Are the courses online or in-person?",
    a: "We offer both online and offline (classroom) formats depending on the course. The format is listed on each course and you can ask us on the contact page.",
  },
  {
    q: "Will I get a certificate and placement help?",
    a: "Yes. You receive a course completion certificate, and we provide placement support including interview preparation and referrals.",
  },
];

export default async function HomePage() {
  const courses = await getActiveCourses();
  const popular = courses.slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--navy-900)] text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60rem 40rem at 70% -10%, rgba(73,210,214,0.18), transparent 60%), radial-gradient(50rem 40rem at 10% 110%, rgba(249,178,51,0.16), transparent 55%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-20 text-center sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--gold-400)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-500)]" />
              Now enrolling
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Learn to code.{" "}
              <span className="text-[var(--gold-500)]">Build a career.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-slate-300">
              Industry-focused courses with flexible monthly payment plans. Register online in
              minutes and track your fees anytime.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="btn-primary px-6 py-3 text-base">
                Enroll now
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] border border-white/20 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Browse courses
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-400">
              Trusted by students across 300+ hiring partners and companies.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Find the right course for you</h2>
            <p className="mt-3 text-[var(--muted)]">
              Explore our tracks and start where it makes sense for you.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.title}
                href="/courses"
                className="card group flex flex-col p-6 transition-shadow hover:shadow-[var(--shadow-float)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--brand)] font-mono text-sm text-[var(--accent)]">
                  {cat.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-[var(--foreground)]">
                  {cat.title}
                </h3>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{cat.desc}</p>
                <span className="mt-4 text-sm font-medium text-[var(--link)] group-hover:underline">
                  View courses →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular courses */}
        <section className="bg-[var(--surface-2)]/60">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">Popular courses</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Pay in full or spread it across monthly installments.
                </p>
              </div>
              <Link
                href="/courses"
                className="hidden text-sm font-medium text-[var(--link)] hover:underline sm:inline"
              >
                See all courses →
              </Link>
            </div>
            {popular.length === 0 ? (
              <div className="card p-10 text-center text-[var(--muted)]">
                Courses will appear here once they&apos;re added in the admin panel.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {popular.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            )}
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

        {/* Why CODE */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Why learn with CODE</h2>
            <p className="mt-3 text-[var(--muted)]">
              Everything is built around one goal — getting you job-ready.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="card flex gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--brand)] text-lg text-[var(--accent)]">
                  {f.icon}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)]">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-[var(--surface-2)]/60">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold sm:text-3xl">Stories from our students</h2>
              <p className="mt-3 text-[var(--muted)]">
                Real people who started where you are now.
              </p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="card flex flex-col p-6">
                  <div aria-hidden className="text-[var(--gold-500)]">
                    ★★★★★
                  </div>
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[var(--body)]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand)] text-sm font-semibold text-[var(--accent)]">
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[var(--foreground)]">
                        {t.name}
                      </span>
                      <span className="block text-xs text-[var(--muted)]">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Commonly asked questions</h2>
            <p className="mt-3 text-[var(--muted)]">
              Everything you need to know before you enroll.
            </p>
          </div>
          <div className="mt-10">
            <Faq items={FAQ} />
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-[var(--navy-900)] text-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-20">
            <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight sm:text-4xl">
              Ready to start your coding journey?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Register online in minutes and pick a payment plan that works for you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="btn-primary px-6 py-3 text-base">
                Enroll now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] border border-white/20 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
