import { prisma } from "@/lib/db";
import { contentFor, type CourseContent } from "@/lib/course-content";

// Read models for the public website. Every function swallows DB errors and
// returns an empty result so a database blip never takes the marketing site
// down — the pages render with whatever they have.

export type PublicCourse = {
  id: number;
  name: string;
  duration: string | null;
  fullPrice: number | null;
  monthlyPrice: number | null;
  monthlyInstallments: number;
  perMonth: number | null;
  content: CourseContent;
};

export type PublicMedia = { id: number; url: string; width: number; height: number; alt: string };

export type PublicOffer = {
  id: number;
  title: string;
  highlight: string | null;
  description: string;
  validFrom: string | null;
  validUntil: string | null;
  image: PublicMedia | null;
};

export type PublicEvent = {
  id: number;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  venue: string | null;
  image: PublicMedia | null;
};

export type PublicGalleryImage = PublicMedia & { caption: string | null };

export function mediaUrl(id: number): string {
  return `/api/media/${id}`;
}

function toMedia(
  m: { id: number; width: number; height: number; alt: string | null } | null | undefined,
  fallbackAlt: string,
): PublicMedia | null {
  if (!m) return null;
  return { id: m.id, url: mediaUrl(m.id), width: m.width, height: m.height, alt: m.alt ?? fallbackAlt };
}

const mediaSelect = { id: true, width: true, height: true, alt: true } as const;

export async function getCourses(): Promise<PublicCourse[]> {
  try {
    const rows = await prisma.course.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        duration: true,
        fullPrice: true,
        monthlyPrice: true,
        monthlyInstallments: true,
      },
    });
    const courses = rows.map((c) => {
      const monthlyPrice = c.monthlyPrice != null ? Number(c.monthlyPrice) : null;
      return {
        id: c.id,
        name: c.name,
        duration: c.duration,
        fullPrice: c.fullPrice != null ? Number(c.fullPrice) : null,
        monthlyPrice,
        monthlyInstallments: c.monthlyInstallments,
        perMonth:
          monthlyPrice != null && c.monthlyInstallments > 0
            ? Math.ceil(monthlyPrice / c.monthlyInstallments)
            : null,
        content: contentFor(c.name),
      };
    });
    // Beginner → advanced reads better than alphabetical for someone choosing.
    const order: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2, Specialist: 3 };
    return courses.sort(
      (a, b) =>
        order[a.content.level] - order[b.content.level] ||
        a.content.track.localeCompare(b.content.track) ||
        a.name.localeCompare(b.name),
    );
  } catch (error) {
    console.error("[content] courses unavailable", error);
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<PublicCourse | null> {
  const courses = await getCourses();
  return courses.find((c) => c.content.slug === slug) ?? null;
}

export async function getActiveOffers(): Promise<PublicOffer[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rows = await prisma.offer.findMany({
      where: {
        isActive: true,
        OR: [{ validUntil: null }, { validUntil: { gte: today } }],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { media: { select: mediaSelect } },
    });
    return rows
      .filter((o) => !o.validFrom || o.validFrom <= today)
      .map((o) => ({
        id: o.id,
        title: o.title,
        highlight: o.highlight,
        description: o.description,
        validFrom: o.validFrom?.toISOString() ?? null,
        validUntil: o.validUntil?.toISOString() ?? null,
        image: toMedia(o.media, o.title),
      }));
  } catch (error) {
    console.error("[content] offers unavailable", error);
    return [];
  }
}

export async function getEvents(): Promise<{ upcoming: PublicEvent[]; past: PublicEvent[] }> {
  try {
    const now = new Date();
    const rows = await prisma.siteEvent.findMany({
      where: { isPublished: true },
      orderBy: { startsAt: "asc" },
      include: { media: { select: mediaSelect } },
    });
    const mapped = rows.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      startsAt: e.startsAt.toISOString(),
      endsAt: e.endsAt?.toISOString() ?? null,
      venue: e.venue,
      image: toMedia(e.media, e.title),
      _end: e.endsAt ?? e.startsAt,
    }));
    const upcoming = mapped.filter((e) => e._end >= now);
    const past = mapped.filter((e) => e._end < now).reverse().slice(0, 12);
    const strip = (e: (typeof mapped)[number]): PublicEvent => {
      const { _end: _omit, ...rest } = e;
      void _omit;
      return rest;
    };
    return { upcoming: upcoming.map(strip), past: past.map(strip) };
  } catch (error) {
    console.error("[content] events unavailable", error);
    return { upcoming: [], past: [] };
  }
}

export async function getGallery(limit?: number): Promise<PublicGalleryImage[]> {
  try {
    const rows = await prisma.galleryImage.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
      include: { media: { select: mediaSelect } },
    });
    return rows.map((g) => ({
      ...(toMedia(g.media, g.caption ?? "CODE computer centre, Bagdogra") as PublicMedia),
      caption: g.caption,
    }));
  } catch (error) {
    console.error("[content] gallery unavailable", error);
    return [];
  }
}
