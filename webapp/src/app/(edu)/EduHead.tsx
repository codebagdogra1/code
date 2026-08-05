import type { HeadResource } from "./_types";

// Renders the EduSmart page's original <head> assets — ~40 stylesheets and the
// inline <style> blocks, in document order — as real elements. React 19 hoists
// stylesheets/styles/icons into <head>, and orders everything in the shared
// "edu" precedence group by insertion order, so the CSS cascade matches the
// original page (and there is no flash of unstyled content).
export function EduHead({
  resources,
  idPrefix = "edu",
}: {
  resources: HeadResource[];
  // Namespaces the inline-style `href` keys React uses to dedupe hoisted styles.
  // Distinct per page-head so a sub-page's delta styles don't collide with (and
  // get dropped against) the shared homepage head's index-keyed styles.
  idPrefix?: string;
}) {
  return (
    <>
      {resources.map((r, i) => {
        if (r.t === "css") {
          return (
            <link
              key={`${idPrefix}-css-${i}`}
              rel="stylesheet"
              href={r.href}
              media={r.media}
              precedence="edu"
            />
          );
        }
        if (r.t === "style") {
          return (
            <style
              key={`${idPrefix}-style-${i}`}
              href={`${idPrefix}-inline-${i}`}
              precedence="edu"
              dangerouslySetInnerHTML={{ __html: r.css }}
            />
          );
        }
        return (
          <link
            key={`${idPrefix}-icon-${i}`}
            rel={r.rel}
            href={r.href}
            {...(r.sizes ? { sizes: r.sizes } : {})}
          />
        );
      })}
    </>
  );
}
