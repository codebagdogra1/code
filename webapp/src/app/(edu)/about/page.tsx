import type { Metadata } from "next";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "About Us — CODE" };

export default function AboutPage() {
  return <EduPage slug="about" />;
}
