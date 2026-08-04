import { prisma } from "@/lib/db";

export type PublicCourse = {
  id: number;
  name: string;
  duration: string | null;
  fullPrice: number | null;
  monthlyPrice: number | null;
  monthlyInstallments: number;
};

// The DB has no course artwork, so we deterministically assign one of the
// vendored EduSmart thumbnails (public/edusmart) by course id — same course
// always gets the same image across the home + courses pages.
const COURSE_THUMBS = [
  "/edusmart/course-1.jpg",
  "/edusmart/course-2.jpg",
  "/edusmart/course-3.jpg",
  "/edusmart/course-4.jpg",
  "/edusmart/course-5.jpg",
  "/edusmart/course-6.jpg",
  "/edusmart/ai-1.jpg",
  "/edusmart/ai-2.jpg",
  "/edusmart/ai-3.jpg",
];

export function courseThumb(id: number): string {
  return COURSE_THUMBS[id % COURSE_THUMBS.length];
}

// Active courses for the public marketing pages (home + courses listing).
// Returns [] if the DB is unreachable so pages still render.
export async function getActiveCourses(): Promise<PublicCourse[]> {
  try {
    const rows = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        duration: true,
        fullPrice: true,
        monthlyPrice: true,
        monthlyInstallments: true,
      },
    });
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      duration: c.duration,
      fullPrice: c.fullPrice != null ? Number(c.fullPrice) : null,
      monthlyPrice: c.monthlyPrice != null ? Number(c.monthlyPrice) : null,
      monthlyInstallments: c.monthlyInstallments,
    }));
  } catch {
    return [];
  }
}
