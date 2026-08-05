import type { Metadata } from "next";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Blog — CODE" };

export default function BlogPage() {
  return <EduPage slug="blog" />;
}
