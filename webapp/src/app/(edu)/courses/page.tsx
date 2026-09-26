import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, coursesSchema } from "@/lib/seo";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "Computer Courses in Bagdogra & Siliguri",
  description: "Explore CCA, DCA, ADCA, web design, ecommerce, AI prompt engineering and digital marketing courses at CODE in Bagdogra.",
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "Computer Courses in Bagdogra & Siliguri",
    description: "Explore practical computer and digital-skills courses at CODE in Bagdogra.",
    url: "/courses",
  },
  twitter: {
    title: "Computer Courses in Bagdogra & Siliguri",
    description: "Explore practical computer and digital-skills courses at CODE in Bagdogra.",
  },
};

export default function CoursesPage() {
  return <>
    <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Courses", path: "/courses" }])} />
    <JsonLd data={coursesSchema()} />
    <EduPage slug="courses" />
  </>;
}
