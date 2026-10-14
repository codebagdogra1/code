import { getCourses } from "@/lib/content";
import { FAQ } from "@/lib/course-content";
import { GLOSSARY, GUIDES, guideContext, type Block } from "@/lib/guides";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { ADDRESS, BUSINESS_NAME, EMAIL, GOOGLE_MAPS_URL, HOURS, HOURS_CLOSED, LANGUAGES, ONE_LINER, PHONE_DISPLAY } from "@/lib/site";

// /llms-full.txt — the llmstxt.org companion to /llms.txt: the full text of
// every course page, guide and glossary term as Markdown, so an assistant that
// fetches one file gets everything quotable without crawling. Same words as
// the HTML pages; this is a mirror, not a separate source of truth.
export const revalidate = 3600;

// [label](/path) → [label](https://host/path); **bold** is already Markdown.
function absolutiseLinks(text: string): string {
  return text.replace(/\]\((\/[^)]*)\)/g, (_, path: string) => `](${absoluteUrl(path)})`);
}

function blockToMarkdown(b: Block): string[] {
  switch (b.type) {
    case "h2":
      return [`## ${b.text}`, ""];
    case "h3":
      return [`### ${b.text}`, ""];
    case "p":
    case "callout":
      return [absolutiseLinks(b.text), ""];
    case "ul":
      return [...b.items.map((i) => `- ${absolutiseLinks(i)}`), ""];
    case "ol":
      return [...b.items.map((i, n) => `${n + 1}. ${absolutiseLinks(i)}`), ""];
    case "table": {
      const row = (cells: string[]) => `| ${cells.map((c) => absolutiseLinks(c).replace(/\|/g, "\\|")).join(" | ")} |`;
      return [
        ...(b.caption ? [`*${b.caption}*`, ""] : []),
        row(b.head),
        `| ${b.head.map(() => "---").join(" | ")} |`,
        ...b.rows.map(row),
        "",
      ];
    }
    case "faq":
      return ["## Frequently asked questions", "", ...b.items.flatMap((f) => [`### ${f.q}`, "", f.a, ""])];
  }
}

export async function GET() {
  const base = siteUrl();
  const courses = await getCourses();
  const ctx = guideContext(courses);

  const lines: string[] = [
    `# ${BUSINESS_NAME} — full text`,
    "",
    `> ${ONE_LINER}`,
    "",
    `Index: ${base}/llms.txt · Website: ${base}`,
    "",
    "## Key facts",
    "",
    `- Address: ${ADDRESS}`,
    `- Phone / WhatsApp: ${PHONE_DISPLAY} · Email: ${EMAIL}`,
    `- Hours: ${HOURS} (${HOURS_CLOSED}) · Google Maps: ${GOOGLE_MAPS_URL}`,
    `- Classes explained in ${LANGUAGES.join(", ")}; in person at the centre in Bagdogra, Siliguri.`,
    "- Every course has a full-payment fee and a monthly plan (one installment per month of the course), a printed receipt for every payment and a CODE certificate on completion. Fees are quoted at the desk or on WhatsApp, not online.",
    "",
    "# Courses",
    "",
  ];

  for (const course of courses) {
    const c = course.content;
    lines.push(`## ${c.displayName}`, "", `URL: ${base}/courses/${c.slug}`, "");
    lines.push(`- Level: ${c.level} · Track: ${c.track}${course.duration ? ` · Duration: ${course.duration}` : ""}`);
    if (c.prerequisites) lines.push(`- Before you join: ${c.prerequisites}`);
    lines.push("", c.definition ?? c.summary, "", `**Who it is for.** ${c.whoFor}`, "");
    if (c.modules.length) lines.push("**Syllabus outline**", "", ...c.modules.map((m) => `- ${m}`), "");
    if (c.outcomes.length) lines.push("**What you will be able to do**", "", ...c.outcomes.map((o) => `- ${o}`), "");
    if (c.summaryBn) lines.push(`**বাংলায়:** ${c.summaryBn}`, "");
    if (c.summaryHi) lines.push(`**हिंदी में:** ${c.summaryHi}`, "");
    if (c.faq?.length) lines.push(...c.faq.flatMap((f) => [`### ${f.q}`, "", f.a, ""]));
  }

  lines.push("# Guides", "");
  for (const g of GUIDES) {
    lines.push(`# ${g.title}`, "", `URL: ${base}/guides/${g.slug} · Published ${g.published} · Updated ${g.updated} · By the trainers at ${BUSINESS_NAME}`, "");
    lines.push(`**Short answer.** ${g.tldr(ctx)}`, "");
    for (const b of g.body(ctx)) lines.push(...blockToMarkdown(b));
  }

  lines.push("# Glossary", "", `URL: ${base}/glossary`, "");
  for (const t of [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))) {
    lines.push(`- **${t.term}**${t.aka?.length ? ` (${t.aka.join(", ")})` : ""}: ${t.definition}`);
  }
  lines.push("", "# General FAQ", "", ...FAQ.flatMap((f) => [`### ${f.q}`, "", f.a, ""]));

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
