import type { Metadata } from "next";
import { EduPage } from "../EduPage";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Gallery — CODE" };

export default function GalleryPage() {
  return <EduPage slug="gallery" />;
}
