import {
  ADDRESS,
  BUSINESS_NAME,
  COUNTRY_CODE,
  EMAIL,
  LOCALITY,
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

export const COURSE_NAMES = [
  "CCA — Certificate in Computer Application",
  "DCA — Diploma in Computer Application",
  "ADCA — Advanced Diploma in Computer Application",
  "Web Design Basic",
  "Web Design Advanced",
  "Ecommerce Expert — Industry Level",
  "Ecommerce Expert — Job Ready",
  "A.I. Prompt Engineering",
] as const;

export function organizationSchema() {
  const url = siteUrl();
  const organizationId = `${url}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": organizationId,
        name: BUSINESS_NAME,
        alternateName: "CODE",
        url,
        logo: absoluteUrl("/logo.png"),
        image: absoluteUrl("/CODE%20Logo.png"),
        description:
          "Practical computer and digital-skills courses for learners in Bagdogra, West Bengal.",
        telephone: PHONE_TEL,
        email: EMAIL,
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
          opens: "11:00",
          closes: "21:00",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: PHONE_DISPLAY,
          email: EMAIL,
          contactType: "admissions",
          availableLanguage: ["en", "hi"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: BUSINESS_NAME,
        publisher: { "@id": organizationId },
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

export function coursesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Computer and digital-skills courses at CODE",
    itemListElement: COURSE_NAMES.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name,
        url: absoluteUrl("/courses"),
        provider: { "@id": `${siteUrl()}/#organization` },
      },
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which computer course is best for beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CCA is a good starting point for learners who want computer fundamentals, MS Office and everyday digital skills. Contact CODE to discuss the course that suits your goal.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between DCA and ADCA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DCA provides a more structured computer-application path, while ADCA is for learners ready to build broader, more advanced digital skills. Ask CODE about the current batch and course fee.",
        },
      },
      {
        "@type": "Question",
        name: "How can I confirm course fees and timings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contact CODE in Bagdogra for the current batch schedule, course fees and guidance on the right learning path.",
        },
      },
    ],
  };
}

export const localBusinessFacts = { ADDRESS, PHONE_DISPLAY, EMAIL };
