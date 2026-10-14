import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Private paths stay out of every index. Search and answer-engine crawlers are
// named explicitly so a future blanket rule can never silently remove the site
// from AI retrieval (ChatGPT search, Perplexity, Claude, Gemini, Copilot).
const PRIVATE = ["/admin", "/api"];

const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Bingbot",
  "Applebot",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_SEARCH_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
