import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const courses = await getCourses();
  const lastModified = new Date();
  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/courses`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...courses.map((c) => ({
      url: `${base}/courses/${c.content.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/offers`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/events`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/gallery`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
