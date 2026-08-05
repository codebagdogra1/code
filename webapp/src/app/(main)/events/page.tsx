import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events — CODE",
  description:
    "Workshops, bootcamps, hackathons and info sessions at CODE, Bagdogra. Reserve your spot and level up your coding skills.",
};

type EventItem = {
  title: string;
  desc: string;
  img: string;
  date: { day: string; month: string };
  time: string;
  location: string;
  tag: string;
  featured?: boolean;
};

const EVENTS: EventItem[] = [
  {
    title: "Full-Stack Web Development Bootcamp",
    desc: "A hands-on weekend intensive covering HTML, CSS, JavaScript and React — build and deploy a live project by Sunday evening.",
    img: "/edusmart/course-1.jpg",
    date: { day: "16", month: "Aug" },
    time: "10:00 AM – 4:00 PM",
    location: "CODE Campus, Bagdogra",
    tag: "Bootcamp",
    featured: true,
  },
  {
    title: "Intro to AI & Machine Learning",
    desc: "A beginner-friendly session on how AI works, with a live demo of building your first model.",
    img: "/edusmart/ai-2.jpg",
    date: { day: "23", month: "Aug" },
    time: "11:00 AM – 1:00 PM",
    location: "CODE Campus, Bagdogra",
    tag: "Workshop",
  },
  {
    title: "Weekend Hackathon: Build for Bagdogra",
    desc: "48 hours, one team, one product. Solve a real local problem with code and pitch to our mentors.",
    img: "/edusmart/course-3.jpg",
    date: { day: "30", month: "Aug" },
    time: "9:00 AM onwards",
    location: "CODE Campus, Bagdogra",
    tag: "Hackathon",
  },
  {
    title: "Career & Placement Info Session",
    desc: "Meet our placement team, hear alumni stories and learn how CODE supports you from portfolio to interview.",
    img: "/edusmart/course-6.jpg",
    date: { day: "06", month: "Sep" },
    time: "5:00 PM – 6:30 PM",
    location: "Online (WhatsApp link)",
    tag: "Info Session",
  },
  {
    title: "UI/UX Design Crash Course",
    desc: "Learn the fundamentals of user-centred design and create a clickable prototype in Figma.",
    img: "/edusmart/course-5.jpg",
    date: { day: "13", month: "Sep" },
    time: "10:00 AM – 2:00 PM",
    location: "CODE Campus, Bagdogra",
    tag: "Workshop",
  },
];

function DateBadge({ day, month }: EventItem["date"]) {
  return (
    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[var(--edu-primary)] text-white">
      <span className="text-xl font-extrabold leading-none">{day}</span>
      <span className="text-xs font-semibold uppercase tracking-wide">{month}</span>
    </div>
  );
}

function MetaRow({ time, location }: { time: string; location: string }) {
  return (
    <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--muted)]">
      <span className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {time}
      </span>
      <span className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
        {location}
      </span>
    </div>
  );
}

export default function EventsPage() {
  const [featured, ...rest] = EVENTS;

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--edu-tint)] to-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="edu-eyebrow mx-auto w-fit">Events</span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Learn, build and connect at{" "}
            <span className="text-[var(--edu-primary)]">CODE</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--body)]">
            Bootcamps, workshops, hackathons and info sessions — hands-on ways to sharpen your skills
            and meet the CODE community.
          </p>
        </div>
      </section>

      {/* Featured event */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <span className="edu-eyebrow">Featured</span>
        <div className="edu-card mt-4 grid gap-0 overflow-hidden lg:grid-cols-2">
          <div className="relative min-h-[260px]">
            <Image
              src={featured.img}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="edu-tag absolute left-5 top-5">{featured.tag}</span>
          </div>
          <div className="flex flex-col p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <DateBadge {...featured.date} />
              <h2 className="text-2xl font-extrabold text-[var(--edu-ink)] sm:text-3xl">
                {featured.title}
              </h2>
            </div>
            <p className="mt-4 text-[var(--body)]">{featured.desc}</p>
            <MetaRow time={featured.time} location={featured.location} />
            <a
              href={whatsappLink(featured.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-btn mt-6 w-fit !px-7 !py-3"
            >
              Reserve your spot
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="edu-eyebrow">Upcoming</span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">More events this season</h2>
          <p className="mt-3 text-[var(--body)]">Reserve early — seats are limited for every session.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {rest.map((ev) => (
            <article key={ev.title} className="edu-card flex flex-col overflow-hidden">
              <div className="relative h-44">
                <Image
                  src={ev.img}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="edu-tag absolute left-4 top-4">{ev.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start gap-4">
                  <DateBadge {...ev.date} />
                  <h3 className="text-lg font-bold text-[var(--edu-ink)]">{ev.title}</h3>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">{ev.desc}</p>
                <MetaRow time={ev.time} location={ev.location} />
                <a
                  href={whatsappLink(ev.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="edu-btn-outline mt-6 w-fit !px-6 !py-2.5"
                >
                  Reserve your spot
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--edu-primary)] px-6 py-16 text-center text-white sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight !text-white sm:text-4xl">
            Can&apos;t find a date that works?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Message us on WhatsApp and we&apos;ll tell you about the next session that fits your schedule.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-btn !bg-white !text-[var(--edu-primary)] hover:!bg-white/90 px-8 py-3.5 text-base"
            >
              Ask on WhatsApp
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
