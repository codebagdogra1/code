import type { Metadata } from "next";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
// This imported template page still contains placeholder editorial content.
// Keep it available to visitors but out of search until original CODE articles exist.
export const metadata: Metadata = {
  title: "Blog — CODE",
  robots: { index: false, follow: true },
};

export default function BlogPage() {
  return <EduPage slug="blog" />;
}
