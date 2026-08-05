import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — CODE",
  description:
    "Coding tips, career advice and student stories from CODE, Bagdogra — practical reads to help you learn to code and land a job.",
};

type Post = {
  title: string;
  excerpt: string;
  img: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
};

const POSTS: Post[] = [
  {
    title: "How to learn to code in 2026 (without burning out)",
    excerpt:
      "A realistic, week-by-week roadmap for absolute beginners — what to learn first, what to ignore, and how to stay consistent when motivation dips.",
    img: "/edusmart/feature-learn.jpg",
    category: "Learning",
    date: "Aug 2, 2026",
    readTime: "6 min read",
    author: "Rahul Verma",
    featured: true,
  },
  {
    title: "Web development vs. Data & AI: which path is right for you?",
    excerpt:
      "Two of the most in-demand tracks compared — the skills, the salaries and the kind of work you'll actually do day to day.",
    img: "/edusmart/ai-3.jpg",
    category: "Careers",
    date: "Jul 28, 2026",
    readTime: "5 min read",
    author: "Sana Kapoor",
  },
  {
    title: "5 projects that get beginners hired",
    excerpt:
      "Certificates are nice, but a portfolio wins interviews. Here are five buildable projects that show employers you can ship.",
    img: "/edusmart/course-4.jpg",
    category: "Projects",
    date: "Jul 21, 2026",
    readTime: "7 min read",
    author: "Imran Ali",
  },
  {
    title: "Cracking your first developer interview",
    excerpt:
      "From DSA basics to talking through your projects with confidence — a calm, practical guide to interview day.",
    img: "/edusmart/course-2.jpg",
    category: "Careers",
    date: "Jul 14, 2026",
    readTime: "8 min read",
    author: "Divya Nair",
  },
  {
    title: "Why small batches make you a better coder",
    excerpt:
      "The research and the real-world reasons that same-day doubt clearing and personal attention beat crowded lecture halls.",
    img: "/edusmart/feature-edu.jpg",
    category: "Learning",
    date: "Jul 7, 2026",
    readTime: "4 min read",
    author: "Rahul Verma",
  },
  {
    title: "A student's story: from zero to first job in 8 months",
    excerpt:
      "How one CODE learner went from never having written a line of code to a paid developer role — in their own words.",
    img: "/edusmart/course-6.jpg",
    category: "Student Stories",
    date: "Jun 30, 2026",
    readTime: "6 min read",
    author: "CODE Team",
  },
];

const CATEGORIES = ["All", "Learning", "Careers", "Projects", "Student Stories"];

function Meta({ date, readTime }: { date: string; readTime: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
      <span>{date}</span>
      <span aria-hidden>•</span>
      <span>{readTime}</span>
    </div>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--edu-tint)] to-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="edu-eyebrow mx-auto w-fit">Blog</span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ideas, tips and{" "}
            <span className="text-[var(--edu-primary)]">student stories</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--body)]">
            Practical reads on learning to code, building a portfolio and landing your first
            developer job — from the CODE team and our instructors.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <article className="edu-card grid gap-0 overflow-hidden lg:grid-cols-2">
          <div className="relative min-h-[260px]">
            <Image
              src={featured.img}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="edu-tag absolute left-5 top-5">Featured</span>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <span className="text-sm font-bold text-[var(--edu-primary)]">{featured.category}</span>
            <h2 className="mt-3 text-2xl font-extrabold text-[var(--edu-ink)] sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-[var(--body)]">{featured.excerpt}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--edu-ink)]">By {featured.author}</span>
              <Meta date={featured.date} readTime={featured.readTime} />
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-btn mt-6 w-fit !px-7 !py-3"
            >
              Read on WhatsApp
            </a>
          </div>
        </article>
      </section>

      {/* Category filters + grid */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-20">
        <div className="flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((c, i) => (
            <span
              key={c}
              className={
                i === 0
                  ? "rounded-full bg-[var(--edu-primary)] px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--edu-ink)]"
              }
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article key={post.title} className="edu-card group flex flex-col overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.img}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="edu-tag absolute left-4 top-4">{post.category}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold leading-snug text-[var(--edu-ink)]">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-[var(--muted)]">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <span className="text-sm font-semibold text-[var(--edu-ink)]">{post.author}</span>
                  <Meta date={post.date} readTime={post.readTime} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--edu-primary)] px-6 py-16 text-center text-white sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight !text-white sm:text-4xl">
            Never miss a new post
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Get coding tips and course updates straight to your WhatsApp — no spam, ever.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-btn !bg-white !text-[var(--edu-primary)] hover:!bg-white/90 px-8 py-3.5 text-base"
            >
              Follow on WhatsApp
            </a>
            <Link href="/courses" className="edu-btn-ghost px-8 py-3.5 text-base">
              Browse courses
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
