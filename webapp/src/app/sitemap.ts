import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const courses = await getCourses();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/courses`, changeFrequency: "weekly", priority: 0.9 },
    ...courses.map((c) => ({
      url: `${base}/courses/${c.content.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/offers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/events`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/gallery`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
