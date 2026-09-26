import type { Metadata } from "next";
import { EduPage } from "../../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "How Online Courses Changed My Life — CODE",
  robots: { index: false, follow: true },
};

export default function BlogPostPage() {
  return <EduPage slug="blog-post" />;
}
