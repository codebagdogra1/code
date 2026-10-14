import type { Metadata } from "next";
import Link from "next/link";
import { OfferCard } from "@/components/site/OfferCard";
import { PhotoCollage } from "@/components/site/PhotoCollage";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { getActiveOffers } from "@/lib/content";
import { OG_IMAGE, breadcrumbSchema } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Current Offers & Admission Discounts",
  description: "Limited-period admission offers, fee discounts and free demo classes at CODE computer centre, Bagdogra.",
  alternates: { canonical: "/offers" },
  openGraph: { ...OG_IMAGE, url: "/offers", title: "Current Offers | CODE Bagdogra" },
};

export default async function OffersPage() {
  const offers = await getActiveOffers();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Offers", path: "/offers" }])} />
      <section className="s-grid s-grid-fade overflow-hidden">
        <div className="s-container grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
            eyebrow="Offers"
            title="Current offers"
            lead="Admission offers running at the centre right now. Mention the offer on WhatsApp or at the desk to claim it."
          />
          </div>
          <PhotoCollage variant="fan" start={1} className="mt-2 lg:mt-0" />
        </div>
      </section>
      <section>
        <div className="s-container pb-16">
          {offers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--s-line-2)] p-10 text-center">
              <p className="text-lg font-semibold text-[var(--s-ink)]">No offers running at the moment.</p>
              <p className="mt-2 text-[var(--s-muted)]">New offers are announced here and on WhatsApp. Ask us about the current fee plans in the meantime.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent">
                  Ask on WhatsApp
                </a>
                <Link href="/courses" className="s-btn s-btn--outline">
                  Browse courses
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {offers.map((o, i) => (
                <OfferCard key={o.id} offer={o} featured={i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
