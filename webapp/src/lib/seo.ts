import {
  BUSINESS_NAME,
  CLOSES,
  COUNTRY_CODE,
  EMAIL,
  GOOGLE_MAPS_URL,
  LOCALITY,
  MAP_LAT,
  MAP_LNG,
  OPENS,
  PHONE_DISPLAY,
  PHONE_TEL,
  POSTAL_CODE,
  REGION,
  STREET_ADDRESS,
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
        alternateName: "CODE",
        url,
        logo: absoluteUrl("/logo.png"),
        image: absoluteUrl("/CODE%20Logo.png"),
        description:
          "Computer training centre in Bagdogra, West Bengal offering CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI prompt engineering courses.",
        telephone: PHONE_TEL,
        email: EMAIL,
        hasMap: GOOGLE_MAPS_URL,
        geo: { "@type": "GeoCoordinates", latitude: MAP_LAT, longitude: MAP_LNG },
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
          availableLanguage: ["en", "hi", "bn"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: BUSINESS_NAME,
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

export function courseSchema(course: {
  name: string;
  slug: string;
  summary: string;
  duration: string | null;
  fullPrice: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.summary,
    url: absoluteUrl(`/courses/${course.slug}`),
    provider: { "@id": organizationId() },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      location: { "@id": organizationId() },
      ...(course.duration ? { courseWorkload: course.duration } : {}),
    },
    ...(course.fullPrice != null
      ? {
          offers: {
            "@type": "Offer",
            price: course.fullPrice,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/courses/${course.slug}`),
          },
        }
      : {}),
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
