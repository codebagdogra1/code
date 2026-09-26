import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, siteUrl } from "@/lib/seo";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "Contact CODE in Bagdogra",
  description: "Contact CODE — Computer & Digital Excellence in Bagdogra for course counselling, fees and batch information.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact CODE in Bagdogra",
    description: "Ask CODE about computer courses, fees, batches and counselling in Bagdogra.",
    url: "/contact",
  },
  twitter: {
    title: "Contact CODE in Bagdogra",
    description: "Ask CODE about computer courses, fees, batches and counselling in Bagdogra.",
  },
};

export default function ContactPage() {
  return <>
    <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", url: `${siteUrl()}/contact`, mainEntity: { "@id": `${siteUrl()}/#organization` } }} />
    <EduPage slug="contact" />
  </>;
}
