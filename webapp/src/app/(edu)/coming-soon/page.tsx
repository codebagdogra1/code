import type { Metadata } from "next";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Coming Soon — CODE" };

export default function ComingSoonPage() {
  return <EduPage slug="coming-soon" standalone />;
}
