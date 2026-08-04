import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/PublicLayout";
import { CourseCard } from "@/components/CourseCard";
import { Faq } from "@/components/Faq";
import { getActiveCourses } from "@/lib/courses";
import { whatsappLink } from "@/lib/site";

// Server component: fetch active courses directly from the DB (no API round-trip).
// Courses change rarely, so serve a prerendered page and revalidate in the
// background every 5 minutes (ISR) instead of hitting the DB on every request.
export const revalidate = 300;

const CATEGORIES = [
  { title: "Web Development", desc: "HTML, CSS, JavaScript, React & full-stack.", icon: "</>" },
  { title: "Data & AI", desc: "Python, data analysis & machine learning.", icon: "◑" },
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
    icon: (
      <path d="M4 5h16M4 12h10M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
  },
  {
    title: "Affordable monthly plans",
    desc: "Pay in full or spread the fee across easy monthly installments. Every payment tracked.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9 9h4.5a2 2 0 010 4H9m0 0h6M12 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Global certification",
    desc: "Graduate with a recognised completion certificate and a portfolio of real projects.",
    icon: (
      <>
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M8.5 13.5 7 21l5-2 5 2-1.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Learn anywhere",
    desc: "Online and classroom formats with mentors who clear your doubts the same day.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The monthly plan made it possible for me to enroll without a loan. I landed a front-end role three months after finishing.",
    name: "Priya S.",
    role: "Front-end Developer",
    avatar: "/edusmart/testimonial-1.png",
  },
  {
    quote:
      "Project-first teaching changed everything. I actually understood what I was building instead of memorising syntax.",
    name: "Arjun M.",
    role: "Full-stack Trainee",
    avatar: "/edusmart/testimonial-2.png",
  },
  {
    quote:
      "The instructors treated us like a team. Doubts were cleared the same day and the pace was just right.",
    name: "Neha R.",
    role: "Data Analytics Student",
    avatar: "/edusmart/testimonial-3.png",
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
    a: "We offer both online and offline (classroom) formats depending on the course. The format is listed on each course and you can ask us on WhatsApp.",
  },
  {
    q: "Will I get a certificate and placement help?",
    a: "Yes. You receive a course completion certificate, and we provide placement support including interview preparation and referrals.",
  },
];

const PARTNERS = [1, 2, 3, 4, 5, 6, 7];

export default async function HomePage() {
  const courses = await getActiveCourses();
  const popular = courses.slice(0, 6);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--edu-tint)] to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[var(--edu-primary)]/10 blur-3xl"
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="edu-eyebrow">Now enrolling · Bagdogra</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-[var(--edu-ink)] sm:text-5xl lg:text-6xl">
              Learn to code.{" "}
              <span className="relative whitespace-nowrap text-[var(--edu-primary)]">
                Build a career.
                <Image
                  src="/edusmart/underline.svg"
                  alt=""
                  width={300}
                  height={20}
                  className="absolute -bottom-3 left-0 h-4 w-full"
                />
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-[var(--body)]">
              Industry-focused courses with flexible monthly payment plans. Talk to us on WhatsApp
              and start your journey in minutes.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="edu-btn px-8 py-3.5 text-base"
              >
                Enroll on WhatsApp
              </a>
              <Link href="/courses" className="edu-btn-outline px-8 py-3.5 text-base">
                Browse courses
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-[var(--edu-ink)]">{s.value}</p>
                  <p className="text-sm text-[var(--muted)]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[2.5rem] bg-[var(--edu-primary)]/10"
            />
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--edu-tint)]">
              <Image
                src="/edusmart/hero-girl.webp"
                alt="A CODE student learning to program"
                width={600}
                height={626}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -left-4 bottom-8 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-[var(--shadow-float)]">
              <span className="edu-chip h-11 w-11 text-xl">🎓</span>
              <div>
                <p className="text-lg font-extrabold leading-none text-[var(--edu-ink)]">2,500+</p>
                <p className="text-xs text-[var(--muted)]">students placed</p>
              </div>
            </div>
            <Image
              src="/edusmart/star.png"
              alt=""
              width={64}
              height={45}
              className="absolute -right-2 top-6 h-10 w-auto animate-pulse"
            />
          </div>
        </div>
      </section>

      {/* Partners strip */}
      <section className="border-y border-[var(--border)] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-4 py-8 opacity-70">
          {PARTNERS.map((n) => (
            <Image
              key={n}
              src={`/edusmart/partner-${n}.png`}
              alt=""
              width={150}
              height={60}
              className="h-8 w-auto object-contain grayscale transition hover:grayscale-0"
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="edu-eyebrow">Categories</span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Let&apos;s find the right course for you
          </h2>
          <p className="mt-3 text-[var(--body)]">Explore our tracks and start where it makes sense.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href="/courses"
              className="edu-card group flex flex-col p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]"
            >
              <span className="edu-chip h-14 w-14 font-mono text-base">{cat.icon}</span>
              <h3 className="mt-5 text-lg font-bold text-[var(--edu-ink)]">{cat.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--muted)]">{cat.desc}</p>
              <span className="mt-4 text-sm font-semibold text-[var(--edu-primary)]">
                View courses →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular courses */}
      <section className="bg-[var(--edu-tint)]/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="edu-eyebrow">Popular courses</span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Explore &amp; build skills</h2>
              <p className="mt-2 text-[var(--body)]">
                Pay in full or spread it across monthly installments.
              </p>
            </div>
            <Link href="/courses" className="edu-btn-outline hidden sm:inline-flex">
              See all courses
            </Link>
          </div>
          {popular.length === 0 ? (
            <div className="edu-card p-10 text-center text-[var(--muted)]">
              Courses will appear here once they&apos;re added in the admin panel.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 -translate-x-5 translate-y-5 rounded-[2rem] bg-[var(--edu-primary)]/10"
            />
            <Image
              src="/edusmart/feature-learn.jpg"
              alt="Students collaborating at CODE"
              width={640}
              height={480}
              className="w-full rounded-[2rem] object-cover shadow-[var(--shadow-float)]"
            />
          </div>
          <div>
            <span className="edu-eyebrow">Why CODE</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Get unlimited access to skills that get you hired
            </h2>
            <p className="mt-3 text-[var(--body)]">
              Everything is built around one goal — getting you job-ready.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title}>
                  <span className="edu-chip h-12 w-12">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                      {f.icon}
                    </svg>
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[var(--edu-ink)]">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
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

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="edu-eyebrow">Testimonials</span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Stories from real students</h2>
          <p className="mt-3 text-[var(--body)]">Real people who started where you are now.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="edu-card flex flex-col p-7">
              <div aria-hidden className="text-lg text-[var(--edu-star)]">★★★★★</div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-[var(--body)]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Image
                  src={t.avatar}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span>
                  <span className="block font-bold text-[var(--edu-ink)]">{t.name}</span>
                  <span className="block text-sm text-[var(--muted)]">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--edu-tint)]/60">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="edu-eyebrow">FAQ</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Commonly asked questions</h2>
            <p className="mt-3 text-[var(--body)]">Everything you need to know before you enroll.</p>
          </div>
          <div className="mt-12">
            <Faq items={FAQ} />
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--edu-primary)] px-6 py-16 text-center text-white sm:px-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to start your coding journey?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/85">
            Message us on WhatsApp and pick a payment plan that works for you.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-btn !bg-white !text-[var(--edu-primary)] hover:!bg-white/90 px-8 py-3.5 text-base"
            >
              Enroll on WhatsApp
            </a>
            <Link href="/contact" className="edu-btn-ghost px-8 py-3.5 text-base">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
