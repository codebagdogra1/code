import type { Metadata } from "next";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { MomentsShowcase } from "@/components/site/MomentsShowcase";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { getGallery } from "@/lib/content";
import { OG_IMAGE, breadcrumbSchema } from "@/lib/seo";
import { GOOGLE_MAPS_URL } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gallery — Inside CODE Computer Centre",
  description: "Photos of the classrooms, computer lab, classes and events at CODE, Bagdogra.",
  alternates: { canonical: "/gallery" },
  openGraph: { ...OG_IMAGE, url: "/gallery", title: "Gallery | CODE Bagdogra" },
};

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }])} />
      <section className="s-grid s-grid-fade">
        <div className="s-container py-14 sm:py-20">
          <SectionHeading eyebrow="Gallery" title="Inside the centre" lead="The lab, the classes and the people. Tap any photo to view it larger." />
        </div>
      </section>
      <MomentsShowcase eyebrow="Student moments" />
      <section>
        <div className="s-container pb-16">
          {images.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--s-line-2)] p-10 text-center">
              <p className="text-lg font-semibold text-[var(--s-ink)]">Photos coming soon.</p>
              <p className="mt-2 text-[var(--s-muted)]">
                Meanwhile, see photos from students and the centre on{" "}
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--s-ink)] underline underline-offset-4">
                  Google Maps
                </a>
                .
              </p>
            </div>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </section>
    </>
  );
}
