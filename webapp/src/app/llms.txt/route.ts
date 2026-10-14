import { getCourses } from "@/lib/content";
import { FAQ } from "@/lib/course-content";
import { siteUrl } from "@/lib/seo";
import {
  ADDRESS,
  AREAS_SERVED,
  BUSINESS_NAME,
  EMAIL,
  GOOGLE_MAPS_URL,
  HOURS,
  HOURS_CLOSED,
  LANGUAGES,
  ONE_LINER,
  PHONE_DISPLAY,
} from "@/lib/site";

// /llms.txt — a plain-text summary of the business for AI assistants that look
// for one (llmstxt.org convention). Everything here is also on the HTML pages;
// this is a convenience index, not a separate source of truth.
export const revalidate = 3600;

export async function GET() {
  const base = siteUrl();
  const courses = await getCourses();

  const lines: string[] = [
    `# ${BUSINESS_NAME}`,
    "",
    `> ${ONE_LINER}`,
    "",
    "## Key facts",
    "",
    `- Website: ${base}`,
    `- Address: ${ADDRESS}`,
    `- Phone / WhatsApp: ${PHONE_DISPLAY}`,
    `- Email: ${EMAIL}`,
    `- Hours: ${HOURS} (${HOURS_CLOSED})`,
    `- Google Maps: ${GOOGLE_MAPS_URL}`,
    `- Classes explained in: ${LANGUAGES.join(", ")}`,
    `- Areas served: ${AREAS_SERVED.join(", ")}`,
    "- Mode: in-person classes at the centre; every course has a full-payment and a monthly fee plan; a printed receipt is issued for every payment; a CODE certificate is awarded on completion.",
    "- Fees are quoted at the desk or on WhatsApp and are not listed online.",
    "",
    "## Courses",
    "",
    ...courses.map((c) => {
      const d = c.duration ? ` (${c.duration})` : "";
      return `- [${c.content.displayName}](${base}/courses/${c.content.slug})${d}: ${c.content.summary}`;
    }),
    "",
    "## Pages",
    "",
    `- [All courses](${base}/courses): every course with duration, level, syllabus outline and who it is for`,
    `- [Current offers](${base}/offers): limited-period admission offers`,
    `- [Events](${base}/events): demo classes, workshops and student events`,
    `- [Gallery](${base}/gallery): photos of the lab, classes and students`,
    `- [About](${base}/about): how the centre teaches`,
    `- [Contact & directions](${base}/contact): phone, WhatsApp, email, map, hours`,
    "",
    "## Frequently asked questions",
    "",
    ...FAQ.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
