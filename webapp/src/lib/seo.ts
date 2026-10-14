import { MAPS_PHOTOS } from "./maps-photos";
import {
  AREAS_SERVED,
  BUSINESS_NAME,
  CLOSES,
  COUNTRY_CODE,
  EMAIL,
  GOOGLE_MAPS_URL,
  LANGUAGE_CODES,
  LOCALITY,
  MAP_LAT,
  MAP_LNG,
  ONE_LINER,
  OPENS,
  PHONE_DISPLAY,
  PHONE_TEL,
  POSTAL_CODE,
  REGION,
  SHORT_NAME,
  STREET_ADDRESS,
  TAGLINE,
} from "./site";

const fallbackSiteUrl = "https://codebagdogra.netlify.app";

/** The one public origin used in canonicals, sitemaps, Open Graph, and JSON-LD. */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return fallbackSiteUrl;
  try {
    return new URL(configured).origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteUrl()}/`).toString();
}

export function organizationId(): string {
  return `${siteUrl()}/#organization`;
}

export function organizationSchema() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": organizationId(),
        name: BUSINESS_NAME,
        alternateName: [SHORT_NAME, "CODE Bagdogra", "Computer and Digital Excellence"],
        slogan: TAGLINE,
        url,
        logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png"), width: 2724, height: 993 },
        // Real photos of the centre and its students first; the logo last.
        image: [...MAPS_PHOTOS.map((p) => absoluteUrl(p.src)), absoluteUrl("/CODE%20Logo.png")],
        description: ONE_LINER,
        telephone: PHONE_TEL,
        email: EMAIL,
        hasMap: GOOGLE_MAPS_URL,
        sameAs: [GOOGLE_MAPS_URL],
        geo: { "@type": "GeoCoordinates", latitude: MAP_LAT, longitude: MAP_LNG },
        areaServed: AREAS_SERVED.map((name) => ({ "@type": "City", name })),
        knowsLanguage: [...LANGUAGE_CODES],
        knowsAbout: [
          "Computer fundamentals",
          "MS Office",
          "Certificate in Computer Application (CCA)",
          "Diploma in Computer Application (DCA)",
          "Advanced Diploma in Computer Application (ADCA)",
          "Web design (HTML, CSS, JavaScript, WordPress)",
          "Ecommerce (Shopify, Amazon, Flipkart, Meesho)",
          "Digital marketing (Meta Ads, Google Business Profile, WhatsApp marketing)",
          "AI prompt engineering (ChatGPT, Gemini)",
        ],
        currenciesAccepted: "INR",
        publicAccess: true,
        address: {
          "@type": "PostalAddress",
          streetAddress: STREET_ADDRESS,
          addressLocality: LOCALITY,
          addressRegion: REGION,
          postalCode: POSTAL_CODE,
          addressCountry: COUNTRY_CODE,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: OPENS,
          closes: CLOSES,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: PHONE_DISPLAY,
          email: EMAIL,
          contactType: "admissions",
          availableLanguage: [...LANGUAGE_CODES],
          areaServed: AREAS_SERVED.map((name) => ({ "@type": "City", name })),
        },
      },
      {
        // Google's site-name signal: must sit on the home page and agree with
        // og:site_name and the <title>. Keeps "Netlify" from being shown as the site.
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: BUSINESS_NAME,
        alternateName: ["CODE Bagdogra", SHORT_NAME],
        publisher: { "@id": organizationId() },
        inLanguage: "en-IN",
      },
    ],
  };
}

export function breadcrumbSchema(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function courseListSchema(courses: ReadonlyArray<{ name: string; slug: string; summary: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Computer and digital-skills courses at CODE, Bagdogra",
    itemListElement: courses.map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: c.name,
        description: c.summary,
        url: absoluteUrl(`/courses/${c.slug}`),
        provider: { "@id": organizationId() },
      },
    })),
  };
}

/** "6 months" → "P6M", "8 weeks" → "P8W", "1 year" → "P1Y"; null when unparseable. */
export function isoDuration(text: string | null | undefined): string | null {
  if (!text) return null;
  const m = text.trim().match(/^(\d+)\s*(day|week|month|year)s?$/i);
  if (!m) return null;
  const unit = { day: "D", week: "W", month: "M", year: "Y" }[m[2].toLowerCase() as "day" | "week" | "month" | "year"];
  return `P${m[1]}${unit}`;
}

export function courseSchema(course: {
  name: string;
  slug: string;
  summary: string;
  duration: string | null;
  level?: string;
  modules?: ReadonlyArray<string>;
  outcomes?: ReadonlyArray<string>;
  prerequisites?: string;
  whoFor?: string;
}) {
  const iso = isoDuration(course.duration);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": absoluteUrl(`/courses/${course.slug}#course`),
    name: course.name,
    description: course.summary,
    url: absoluteUrl(`/courses/${course.slug}`),
    provider: { "@id": organizationId() },
    inLanguage: [...LANGUAGE_CODES],
    ...(course.level ? { educationalLevel: course.level } : {}),
    ...(course.prerequisites ? { coursePrerequisites: course.prerequisites } : {}),
    ...(course.whoFor ? { audience: { "@type": "EducationalAudience", audienceType: course.whoFor } } : {}),
    ...(course.outcomes?.length ? { teaches: [...course.outcomes] } : {}),
    ...(course.modules?.length
      ? { syllabusSections: course.modules.map((m) => ({ "@type": "Syllabus", name: m })) }
      : {}),
    ...(iso ? { timeRequired: iso } : {}),
    educationalCredentialAwarded: `Certificate from ${BUSINESS_NAME}`,
    // Paid course; the fee is quoted at the desk, so no price is published.
    offers: { "@type": "Offer", category: "Paid", priceCurrency: "INR", availability: "https://schema.org/InStock" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      location: { "@id": organizationId() },
      instructor: { "@id": organizationId() },
      ...(course.duration ? { courseWorkload: course.duration } : {}),
      ...(iso ? { duration: iso } : {}),
    },
  };
}

export function faqSchema(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function eventSchema(e: {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  venue: string | null;
  imageUrl: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.description,
    startDate: e.startsAt,
    ...(e.endsAt ? { endDate: e.endsAt } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: e.venue
      ? { "@type": "Place", name: e.venue, address: { "@id": organizationId() } }
      : { "@id": organizationId() },
    organizer: { "@id": organizationId() },
    ...(e.imageUrl ? { image: absoluteUrl(e.imageUrl) } : {}),
  };
}

/**
 * Pages that set their own `openGraph` replace the layout's object wholesale,
 * which also drops the file-based card. Spread this in to keep the image.
 */
export const OG_IMAGE: { images: { url: string; width: number; height: number; alt: string }[] } = {
  images: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "CODE — Computer & Digital Excellence, computer training centre in Bagdogra",
    },
  ],
};
