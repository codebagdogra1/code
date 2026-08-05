import type { Metadata } from "next";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Courses — CODE" };

export default function CoursesPage() {
  return <EduPage slug="courses" />;
}
