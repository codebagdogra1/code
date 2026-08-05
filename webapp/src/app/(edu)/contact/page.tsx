import type { Metadata } from "next";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Contact — CODE" };

export default function ContactPage() {
  return <EduPage slug="contact" />;
}
