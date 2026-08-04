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

const PARTNERS = [1, 2, 3, 4, 5, 6, 7];

const CATEGORY_PILLS = [
  { label: "All Courses", count: "40+" },
  { label: "Web Development", count: "12" },
  { label: "Data & AI", count: "8" },
  { label: "Programming", count: "10" },
  { label: "Design & Tools", count: "6" },
  { label: "Career", count: "4" },
];

const INVEST = [
  {
    title: "Learn Anything",
    desc: "Explore any track — web, data, AI or core programming — and advance real, hireable skills.",
    ground: "var(--edu-soft-blue)",
    tint: "#2b7fff",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Save Money",
    desc: "Pay in full or spread the fee across easy monthly installments — no loan, no hidden cost.",
    ground: "var(--edu-soft-pink)",
    tint: "#f0526a",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M9.5 9.5h4a2 2 0 0 1 0 4h-4m0 0h5M12 7.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Flexible Learning",
    desc: "Online or classroom, at a pace that fits you — switch formats whenever you need to.",
    ground: "var(--edu-soft-green)",
    tint: "#22a35a",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Certificate + Placement",
    desc: "Graduate with a recognised certificate, a real project portfolio and interview support.",
    ground: "var(--edu-soft-purple)",
    tint: "#8a4fe0",
    icon: (
      <>
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M8.5 13.5 7 21l5-2 5 2-1.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

const ACCESS_FEATURES = [
  { title: "Project-first Learning", ground: "var(--edu-soft-blue)", tint: "#2b7fff", icon: <path d="M4 5h16M4 12h10M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> },
  { title: "Global Certification", ground: "var(--edu-soft-pink)", tint: "#f0526a", icon: <><circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2" /><path d="M8.5 13.5 7 21l5-2 5 2-1.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></> },
  { title: "Affordable Pricing", ground: "var(--edu-soft-purple)", tint: "#8a4fe0", icon: <><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" /><path d="M9.5 9.5h4a2 2 0 0 1 0 4h-4m0 0h5M12 7.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> },
  { title: "Learn Anywhere", ground: "var(--edu-soft-green)", tint: "#22a35a", icon: <><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> },
];

const STATS = [
  { value: "2.5K+", label: "Successfully Trained", tint: "#f0526a" },
  { value: "40+", label: "Courses Offered", tint: "#8a4fe0" },
  { value: "92%", label: "Placement Support", tint: "#0171f1" },
  { value: "25+", label: "Expert Instructors", tint: "#22a35a" },
];

const INSTRUCTORS = [
  { name: "Rahul Verma", role: "Full-Stack Mentor", avatar: "/edusmart/avatar-1.png", ring: "#d6f1fe" },
  { name: "Sana Iqbal", role: "Data & AI Lead", avatar: "/edusmart/avatar-2.png", ring: "#fde5f1" },
  { name: "Arjun Das", role: "DSA Instructor", avatar: "/edusmart/avatar-3.png", ring: "#e7e0ff" },
  { name: "Meera Nair", role: "UI/UX Coach", avatar: "/edusmart/avatar-4.png", ring: "#ffe9c9" },
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
    a: "No. Our foundation courses start from the absolute basics. More advanced tracks list any prerequisites on the course details — just ask us on WhatsApp if you're unsure.",
  },
  {
    q: "How do the monthly payment plans work?",
    a: "You can pay the full course fee upfront or split it across monthly installments. After you enroll, every installment and payment is tracked in your student record.",
  },
  {
    q: "Are the courses online or in-person?",
    a: "We offer both online and offline (classroom) formats depending on the course. The format is listed on each course, and you can confirm with us on WhatsApp.",
  },
  {
    q: "Will I get a certificate and placement help?",
    a: "Yes. You receive a course-completion certificate, and we provide placement support including interview preparation and referrals.",
  },
];

// Small decorative 4-point sparkle.
function Sparkle({ className, color }: { className?: string; color: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 0c.6 6 5.4 10.8 12 12-6.6 1.2-11.4 6-12 12-.6-6-5.4-10.8-12-12C6.6 10.8 11.4 6 12 0Z" fill={color} />
    </svg>
  );
}

export default async function HomePage() {
  const courses = await getActiveCourses();
  const popular = courses.slice(0, 8);

  return (
    <PublicLayout>
      {/* ================= HERO ================= */}
      <section className="edu-aurora relative overflow-hidden">
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          {/* Copy */}
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--edu-ink)] sm:text-5xl lg:text-[3.9rem]">
              Learn to Code,
              <br />
              Build Your{" "}
              <span className="relative whitespace-nowrap text-[var(--edu-magenta)]">
                Future
                <Image
                  src="/edusmart/underline.svg"
                  alt=""
                  width={300}
                  height={20}
                  className="absolute -bottom-2 left-0 h-4 w-full"
                />
              </span>
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--body)]">
              Discover industry-focused coding courses with flexible monthly payment plans. Message
              us on WhatsApp and start your journey in minutes.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/courses" className="edu-btn text-base">
                Explore Courses
              </Link>
              <Link href="/about" className="edu-btn-outline text-base">
                About Us
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-md">
            <Sparkle className="absolute -left-2 top-6 h-6 w-6" color="#31c8ff" />
            <Sparkle className="absolute right-10 -top-2 h-8 w-8" color="#ff9d2e" />
            <Sparkle className="absolute -right-1 top-40 h-5 w-5" color="#ffd6ef" />

            <div className="relative aspect-square overflow-hidden rounded-full bg-gradient-to-br from-[#2ec5ff] to-[#0171f1]">
              <Image
                src="/edusmart/hero-girl.webp"
                alt="A CODE student ready to learn programming"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 460px"
                className="object-cover object-top"
              />
            </div>

            {/* Rotating badge */}
            <div className="absolute -left-4 bottom-10 grid h-28 w-28 place-items-center rounded-full bg-white/85 shadow-[var(--shadow-float)] backdrop-blur">
              <svg viewBox="0 0 100 100" className="edu-spin absolute inset-0 h-full w-full">
                <defs>
                  <path id="badge" d="M50 50 m -36 0 a 36 36 0 1 1 72 0 a 36 36 0 1 1 -72 0" />
                </defs>
                <text className="fill-[var(--edu-ink)]" fontSize="9.5" fontWeight="700" letterSpacing="1.5">
                  <textPath href="#badge" startOffset="0%">
                    · ONLINE LEARNING · LEARN MORE
                  </textPath>
                </text>
              </svg>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--edu-primary)] text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            {/* Floating student card */}
            <div className="absolute -right-2 bottom-16 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-[var(--shadow-float)] backdrop-blur">
              <div className="flex -space-x-2.5">
                {["/edusmart/avatar-1.png", "/edusmart/avatar-2.png", "/edusmart/avatar-3.png"].map((a) => (
                  <Image key={a} src={a} alt="" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-white object-cover" />
                ))}
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[var(--edu-primary)] text-xs font-bold text-white">
                  +
                </span>
              </div>
              <div>
                <p className="text-base font-extrabold leading-none text-[var(--edu-ink)]">2.5K</p>
                <p className="text-xs text-[var(--muted)]">Students joined</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PARTNERS ================= */}
      <section className="relative z-10 mx-auto -mt-8 w-full max-w-6xl px-4">
        <div className="edu-card px-6 py-10 sm:px-10">
          <p className="text-center text-base font-bold text-[var(--edu-ink)]">
            We collaborate with 50+ leading companies and hiring partners
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
            {PARTNERS.map((n) => (
              <Image
                key={n}
                src={`/edusmart/partner-${n}.png`}
                alt=""
                width={150}
                height={60}
                className="h-7 w-auto object-contain grayscale transition hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= INVEST IN YOUR CAREER ================= */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Invest In Your Career With CODE</h2>
          <p className="mt-4 text-[var(--body)]">
            Get access to industry-focused courses taught by mentors who&apos;ve shipped real
            products — no filler, just the skills employers hire for.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INVEST.map((f) => (
            <div
              key={f.title}
              className="relative flex flex-col rounded-[var(--radius-card)] p-7"
              style={{ background: f.ground }}
            >
              <span
                aria-hidden
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80"
                style={{ color: f.tint }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white" style={{ color: f.tint }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  {f.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-bold text-[var(--edu-ink)]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--body)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="bg-[var(--edu-tint-2)]/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Explore Our Courses And Build Skills</h2>
            <p className="text-[var(--body)] lg:pb-1">
              Welcome to our diverse and dynamic course catalog. Pay in full or spread the fee across
              easy monthly installments.
            </p>
          </div>

          {/* Category pills */}
          <div className="mt-10 flex flex-wrap gap-3">
            {CATEGORY_PILLS.map((c, i) => (
              <span
                key={c.label}
                className={`inline-flex flex-col rounded-2xl border px-5 py-2.5 text-left ${
                  i === 0
                    ? "border-transparent bg-[var(--edu-tint)] text-[var(--edu-primary)]"
                    : "border-[var(--border)] bg-white text-[var(--edu-ink)]"
                }`}
              >
                <span className="text-sm font-bold leading-tight">{c.label}</span>
                <span className="text-xs text-[var(--muted)]">{c.count} Courses</span>
              </span>
            ))}
          </div>

          {popular.length === 0 ? (
            <div className="edu-card mt-10 p-10 text-center text-[var(--muted)]">
              Courses will appear here once they&apos;re added in the admin panel.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/courses" className="edu-btn text-base">
              Browse More Courses
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= UNLIMITED ACCESS ================= */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image on blob */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 scale-110 rounded-[45%_55%_52%_48%/55%_45%_55%_45%] bg-[var(--edu-tint)]"
            />
            <Sparkle className="absolute -left-1 top-6 h-6 w-6" color="#8a4fe0" />
            <Sparkle className="absolute right-4 top-0 h-5 w-5" color="#22a35a" />
            <Image
              src="/edusmart/feature-learn.jpg"
              alt="A CODE student who completed the program"
              width={596}
              height={618}
              className="w-full rounded-[2rem] object-cover"
            />
            <div className="absolute -bottom-4 left-6 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-[var(--shadow-float)] backdrop-blur">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--edu-primary)] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <div>
                <p className="text-lg font-extrabold leading-none text-[var(--edu-ink)]">2.4K</p>
                <p className="text-xs text-[var(--muted)]">Positive reviews</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Get Unlimited Access To Every Skill</h2>
            <p className="mt-4 text-[var(--body)]">
              Learn anything, anytime, without limits on your growth. Everything is built around one
              goal — getting you job-ready at a pace that fits your life.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ACCESS_FEATURES.map((f) => (
                <div key={f.title} className="edu-card flex items-center gap-3 p-4">
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-full" style={{ background: f.ground, color: f.tint }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      {f.icon}
                    </svg>
                  </span>
                  <span className="text-sm font-bold text-[var(--edu-ink)]">{f.title}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className="edu-btn mt-8 text-base">
              Get In Touch
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STATS BAND ================= */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-y-8 rounded-[var(--radius-card)] bg-gradient-to-r from-[#f6ecfb] via-[#e7f1fe] to-[#e6f7ee] px-6 py-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: s.tint }}>
                {s.value}
              </p>
              <p className="mt-1 text-sm text-[var(--body)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= INSTRUCTORS ================= */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Meet Our Instructors</h2>
          <p className="mt-3 text-[var(--body)]">Mentors from across the industry, teaching what they build.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INSTRUCTORS.map((t) => (
            <div key={t.name} className="edu-card flex flex-col items-center p-7 text-center">
              <span
                className="grid h-32 w-32 place-items-center overflow-hidden rounded-full"
                style={{ background: t.ring }}
              >
                <Image src={t.avatar} alt={t.name} width={128} height={128} className="h-full w-full object-cover" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-[var(--edu-ink)]">{t.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-[var(--edu-tint-2)]/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">What Our Students Say</h2>
              <p className="mt-3 max-w-lg text-[var(--body)]">
                We take immense pride in the impact our courses and community have on learners&apos;
                lives.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-2xl font-extrabold text-[var(--edu-price)]">9/10</p>
                <p className="mt-1 text-sm text-[var(--body)]">learners report better outcomes after finishing</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[var(--edu-primary)]">92%</p>
                <p className="mt-1 text-sm text-[var(--body)]">of students complete their enrolled course</p>
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="edu-card flex flex-col p-7">
                <div aria-hidden className="text-lg text-[var(--edu-star)]">★★★★★</div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-[var(--body)]">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Image src={t.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                  <span>
                    <span className="block font-bold text-[var(--edu-ink)]">{t.name}</span>
                    <span className="block text-sm text-[var(--muted)]">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DUAL CTA BANNERS ================= */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-[#fbe3f1] to-[#fdeef6] p-9">
            <h3 className="text-2xl font-extrabold text-[var(--edu-ink)]">Not sure where to start?</h3>
            <p className="mt-3 max-w-sm text-[var(--body)]">
              Tell us your goal on WhatsApp and we&apos;ll recommend the right course and payment plan.
            </p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="edu-btn mt-6">
              Chat with us
            </a>
          </div>
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-[#d6f6e6] to-[#e9f9f0] p-9">
            <h3 className="text-2xl font-extrabold text-[var(--edu-ink)]">Ready to start learning?</h3>
            <p className="mt-3 max-w-sm text-[var(--body)]">
              Browse our full catalog and enroll in minutes — online or in our Bagdogra classroom.
            </p>
            <Link href="/courses" className="edu-btn mt-6">
              Start Learning Today
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Commonly Asked Questions</h2>
            <p className="mt-3 text-[var(--body)]">Everything you need to know before you enroll.</p>
            <div className="mt-8">
              <Faq items={FAQ} />
            </div>
          </div>
          {/* Image collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Image src="/edusmart/ai-1.jpg" alt="" width={290} height={291} className="w-full rounded-2xl object-cover" />
              <div className="edu-card flex items-center gap-3 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--edu-ink)] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                </span>
                <div>
                  <p className="text-lg font-extrabold leading-none text-[var(--edu-ink)]">1,800+</p>
                  <p className="text-xs text-[var(--muted)]">Certificates awarded</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="edu-card flex items-center gap-3 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--edu-primary)] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8l10 5 8-4v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div>
                  <p className="text-lg font-extrabold leading-none text-[var(--edu-ink)]">2.5K+</p>
                  <p className="text-xs text-[var(--muted)]">Learners trained</p>
                </div>
              </div>
              <Image src="/edusmart/ai-2.jpg" alt="" width={303} height={376} className="w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA BAND ================= */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="edu-aurora relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12">
          <Sparkle className="absolute left-10 top-8 h-6 w-6" color="#31c8ff" />
          <Sparkle className="absolute right-12 bottom-10 h-7 w-7" color="#ff9d2e" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Start building your coding career today
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[var(--body)]">
            Message us on WhatsApp, pick a payment plan that works for you, and take the first step.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="edu-btn text-base">
              Enroll on WhatsApp
            </a>
            <Link href="/contact" className="edu-btn-outline text-base">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
