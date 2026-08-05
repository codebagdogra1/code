import { EduBodyClass } from "./EduBodyClass";
import { EduHead } from "./EduHead";
import { EduScripts } from "./EduScripts";
import {
  getFooter,
  getHeader,
  getPageBodyClass,
  getPageContent,
  getPageHead,
  getScripts,
} from "./_snippets";

// Renders a mirrored EduSmart demo sub-page (contact, about, courses, blog, …).
// The shared site header + footer come from the same snippets the homepage uses;
// only the page's unique main content is per-slug (extracted by
// scripts/split-pages.py). The whole thing is injected as one HTML blob inside a
// `display:contents` wrapper so the header, content and footer stay *direct*
// body children — exactly as the original WordPress page had them, which the
// theme's structural CSS and sticky-header JS depend on. Runtime JS is replayed
// by <EduScripts/> after mount, reusing the homepage's ordered script manifest.
//
// `standalone` pages (the Elementor-canvas coming-soon / maintenance template)
// carry their own full-page chrome, so the shared header/footer/back-to-top are
// omitted.
export function EduPage({
  slug,
  standalone = false,
}: {
  slug: string;
  standalone?: boolean;
}) {
  const content = getPageContent(slug);

  const bodyHtml = standalone
    ? content
    : `<div id="wcbt-quick-view-popup"></div>\n` +
      getHeader() +
      `\n${content}\n` +
      getFooter() +
      `\n<div id="back-to-top" class="btn-back-to-top high-bottom"><i class="tk tk-arrow-up"></i></div>`;

  return (
    <>
      {/* Page-specific inline styles (Elementor kit globals + per-page CSS),
          hoisted into <head> by React after the shared homepage head. */}
      <EduHead resources={getPageHead(slug)} idPrefix={`edu-${slug}`} />
      {!standalone && <EduBodyClass className={getPageBodyClass(slug)} />}
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <EduScripts scripts={getScripts()} />
    </>
  );
}
