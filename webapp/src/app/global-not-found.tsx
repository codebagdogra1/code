import type { Metadata } from "next";

import { EduHead } from "./(edu)/EduHead";
import { EduScripts } from "./(edu)/EduScripts";
import {
  getFooter,
  getHead,
  getHeader,
  getPageBodyClass,
  getPageContent,
  getPageHead,
  getScripts,
} from "./(edu)/_snippets";

// App-wide 404 for unmatched URLs. Because this app has multiple root layouts,
// `global-not-found` (enabled via experimental.globalNotFound) is the only way to
// give every unmatched route a consistent page — it bypasses layouts, so this
// file brings its own <html>/<body> and loads the EduSmart head/CSS itself,
// mirroring the (edu) root layout. Content is the extracted demo 404 template.
export const metadata: Metadata = { title: "Page not found — CODE" };

export default function GlobalNotFound() {
  const bodyHtml =
    `<div id="wcbt-quick-view-popup"></div>\n` +
    getHeader() +
    `\n${getPageContent("not-found")}\n` +
    getFooter() +
    `\n<div id="back-to-top" class="btn-back-to-top high-bottom"><i class="tk tk-arrow-up"></i></div>`;

  return (
    <html lang="en-US">
      <body className={getPageBodyClass("not-found")}>
        <EduHead resources={getHead()} />
        <EduHead resources={getPageHead("not-found")} idPrefix="edu-not-found" />
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        <EduScripts scripts={getScripts()} />
      </body>
    </html>
  );
}
