import { prisma } from "@/lib/db";

export type PublicCourse = {
  id: number;
  name: string;
  duration: string | null;
  fullPrice: number | null;
  monthlyPrice: number | null;
  monthlyInstallments: number;
};

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
