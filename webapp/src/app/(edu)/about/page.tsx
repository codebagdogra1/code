import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, siteUrl } from "@/lib/seo";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "About CODE Computer & Digital Excellence",
  description: "Learn about CODE, a practical computer and digital-skills training centre in Bagdogra, West Bengal.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CODE Computer & Digital Excellence",
    description: "Learn about CODE, a practical computer and digital-skills training centre in Bagdogra, West Bengal.",
    url: "/about",
  },
  twitter: {
    title: "About CODE Computer & Digital Excellence",
    description: "Learn about CODE, a practical computer and digital-skills training centre in Bagdogra, West Bengal.",
  },
};

export default function AboutPage() {
  return <>
    <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About CODE", path: "/about" }])} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", url: `${siteUrl()}/about`, about: { "@id": `${siteUrl()}/#organization` } }} />
    <EduPage slug="about" />
  </>;
}
