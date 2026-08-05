import type { Metadata } from "next";

import { EduHead } from "./EduHead";
import { getBodyClass, getHead } from "./_snippets";

// A *separate root layout* for the EduSmart homepage (route group `(edu)`).
// It owns its own <html>/<body> with the original WordPress body classes and
// loads only the EduSmart CSS — the main app's Tailwind/globals.css never touch
// this route, and vice-versa. Navigating between this world and the `(main)`
// pages triggers a full reload (Next's multiple-root-layout behaviour), which is
// exactly right for two independent visual systems.
export const metadata: Metadata = {
  title: "Computer & Digital Excellence | Best Computer centre in Bagdogra",
};

export default function EduLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body className={getBodyClass()}>
        <EduHead resources={getHead()} />
        {children}
      </body>
    </html>
  );
}
