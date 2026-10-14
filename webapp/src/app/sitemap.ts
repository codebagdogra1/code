import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/content";
import { COURSE_CONTENT_UPDATED } from "@/lib/course-content";
import { AREAS, AREAS_UPDATED } from "@/lib/areas";
import { GLOSSARY_UPDATED, GUIDES } from "@/lib/guides";
import { siteUrl } from "@/lib/seo";
import { SITE_CONTENT_UPDATED } from "@/lib/site";

export const revalidate = 3600;

// lastmod is the date the words last changed, never the build time: Google
// only trusts lastmod when it is verifiably accurate and ignores it otherwise.
// Offers, events and gallery change through /admin, so they carry no lastmod.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const courses = await getCourses();
  const site = new Date(SITE_CONTENT_UPDATED);
  const latestGuide = new Date(GUIDES.map((g) => g.updated).sort().at(-1) ?? SITE_CONTENT_UPDATED);
  return [
    { url: base, lastModified: site, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/courses`, lastModified: new Date(COURSE_CONTENT_UPDATED), changeFrequency: "weekly", priority: 0.9 },
    ...courses.map((c) => ({
      url: `${base}/courses/${c.content.slug}`,
      lastModified: new Date(COURSE_CONTENT_UPDATED),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/guides`, lastModified: latestGuide, changeFrequency: "monthly", priority: 0.8 },
    ...GUIDES.map((g) => ({
      url: `${base}/guides/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/glossary`, lastModified: new Date(GLOSSARY_UPDATED), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/areas`, lastModified: new Date(AREAS_UPDATED), changeFrequency: "monthly", priority: 0.6 },
    ...AREAS.map((a) => ({
      url: `${base}/areas/${a.slug}`,
      lastModified: new Date(a.updated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${base}/offers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/events`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/gallery`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, lastModified: site, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: site, changeFrequency: "monthly", priority: 0.7 },
  ];
}
