import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery — CODE",
  description:
    "A look inside CODE — classrooms, projects, workshops and the moments that make learning to code at Bagdogra memorable.",
};

const STATS = [
  { value: "2,500+", label: "Students trained", tint: "#f0526a" },
  { value: "120+", label: "Batches completed", tint: "#8a4fe0" },
  { value: "40+", label: "Workshops hosted", tint: "#0171f1" },
];

// A curated grid of moments from the institute. `span` controls how much room a
// tile takes on large screens so the layout reads as an editorial collage
// rather than a plain grid.
const PHOTOS: { src: string; alt: string; tag: string; span: string }[] = [
  { src: "/edusmart/feature-edu.jpg", alt: "A live coding session in progress", tag: "Classroom", span: "lg:col-span-2 lg:row-span-2" },
  { src: "/edusmart/course-1.jpg", alt: "Students pair-programming", tag: "Workshop", span: "" },
  { src: "/edusmart/ai-1.jpg", alt: "AI & data science lab", tag: "AI Lab", span: "" },
  { src: "/edusmart/course-3.jpg", alt: "Project demo day", tag: "Demo Day", span: "lg:col-span-2" },
  { src: "/edusmart/feature-learn.jpg", alt: "Instructor mentoring a student", tag: "Mentoring", span: "" },
  { src: "/edusmart/course-5.jpg", alt: "Group project discussion", tag: "Teamwork", span: "" },
  { src: "/edusmart/ai-2.jpg", alt: "Hands-on hardware workshop", tag: "Workshop", span: "" },
  { src: "/edusmart/course-2.jpg", alt: "Celebrating a batch graduation", tag: "Graduation", span: "lg:col-span-2" },
  { src: "/edusmart/course-6.jpg", alt: "Career guidance session", tag: "Careers", span: "" },
];

export default function GalleryPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--edu-tint)] to-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="edu-eyebrow mx-auto w-fit">Gallery</span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Life at <span className="text-[var(--edu-primary)]">CODE</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--body)]">
            Classrooms, workshops, project demos and the everyday moments where learners turn their
            first line of code into real skills.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="grid grid-cols-3 gap-y-8 rounded-[var(--radius-card)] bg-gradient-to-r from-[#f6ecfb] via-[#e7f1fe] to-[#e6f7ee] px-6 py-10">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold tracking-tight sm:text-4xl" style={{ color: s.tint }}>
                {s.value}
              </p>
              <p className="mt-1 text-sm text-[var(--body)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo grid */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PHOTOS.map((p) => (
            <figure
              key={p.src}
              className={`group relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-float)] ${p.span}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-90" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <span className="text-sm font-semibold text-white">{p.alt}</span>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-[var(--edu-ink)]">
                  {p.tag}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--edu-primary)] px-6 py-16 text-center text-white sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight !text-white sm:text-4xl">
            Want to be in the next batch photo?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Browse our courses or message us on WhatsApp to reserve your seat.
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
