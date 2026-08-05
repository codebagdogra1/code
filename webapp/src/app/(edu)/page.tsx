import { EduScripts } from "./EduScripts";
import { getFooter, getHeader, getScripts, getSections } from "./_snippets";

// The EduSmart homepage, ported from the static monolith into a React route.
// It is assembled from snippet files (header + 12 sections + footer, generated
// by scripts/split-home.py) and rendered as one HTML injection so the header,
// the `.elementor-10` content wrapper, the footer and the back-to-top button
// stay *direct* body children — keeping Elementor's structural CSS/JS and the
// theme's sticky-header script working. The runtime JS is replayed by
// <EduScripts/> after mount. Fully static: the snippet reads happen at build.
export const dynamic = "force-static";

export default function EduHome() {
  const bodyHtml =
    `<div id="wcbt-quick-view-popup"></div>\n` +
    getHeader() +
    `\n<div data-elementor-type="wp-page" data-elementor-id="10" class="elementor elementor-10">\n` +
    getSections() +
    `\n</div>\n` +
    getFooter() +
    `\n<div id="back-to-top" class="btn-back-to-top high-bottom"><i class="tk tk-arrow-up"></i></div>`;

  return (
    <>
      {/* display:contents keeps these from introducing a layout box, so the
          injected chrome behaves as if it were a direct child of <body>. */}
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <EduScripts scripts={getScripts()} />
    </>
  );
}
