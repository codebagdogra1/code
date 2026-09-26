import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

import { EduHead } from "./EduHead";
import { getBodyClass, getHead } from "./_snippets";

// A *separate root layout* for the EduSmart homepage (route group `(edu)`).
// It owns its own <html>/<body> with the original WordPress body classes and
// loads only the EduSmart CSS — the main app's Tailwind/globals.css never touch
// this route, and vice-versa. Navigating between this world and the `(main)`
// pages triggers a full reload (Next's multiple-root-layout behaviour), which is
// exactly right for two independent visual systems.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Computer Courses in Bagdogra | CODE", template: "%s | CODE Bagdogra" },
  description: "Practical computer and digital-skills courses in Bagdogra. Explore CCA, DCA, ADCA, web design, ecommerce, AI prompt engineering and digital marketing at CODE.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CODE — Computer & Digital Excellence",
    title: "Computer Courses in Bagdogra | CODE",
    description: "Practical computer and digital-skills courses in Bagdogra.",
    url: "/",
    images: [{ url: "/CODE%20Logo.png", alt: "CODE — Computer & Digital Excellence, Bagdogra" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Computer Courses in Bagdogra | CODE",
    description: "Practical computer and digital-skills courses in Bagdogra.",
    images: ["/CODE%20Logo.png"],
  },
  robots: { index: true, follow: true },
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
