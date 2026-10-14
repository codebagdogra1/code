import type { Metadata } from "next";
import Link from "next/link";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { MediaImage } from "@/components/site/MediaImage";
import { PhotoCollage } from "@/components/site/PhotoCollage";
import { PhotoMarquee } from "@/components/site/PhotoMarquee";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { getGallery } from "@/lib/content";
import { breadcrumbSchema, organizationId, siteUrl } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About CODE — Computer Training Centre in Bagdogra",
  description:
    "CODE (Computer & Digital Excellence) is a computer training centre in Bagdogra, Siliguri, teaching practical computer, web, ecommerce, marketing and AI skills in small batches.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "About CODE Bagdogra" },
};

const VALUES = [
  { title: "Practice over theory", text: "A lesson is not finished until you have done it yourself on the machine in front of you." },
  { title: "Honest fees", text: "One clear fee quoted at the desk, monthly plans, printed receipts, no surprises." },
  { title: "Local and reachable", text: "We are in Lokenath Nagar, Bagdogra. Drop in, call, or message on WhatsApp — a real person answers." },
  { title: "Skills that get used", text: "Courses are built around what students, shop owners and job seekers in Siliguri actually need." },
];

export default async function AboutPage() {
  const photos = await getGallery(4);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", url: `${siteUrl()}/about`, about: { "@id": organizationId() } }} />

      <section className="s-grid s-grid-fade">
        <div className="s-container py-14 sm:py-20">
          <SectionHeading
            eyebrow="About"
            title="A computer centre for Bagdogra, run by people who teach"
            lead="CODE — Computer & Digital Excellence — is an independent training centre in Bagdogra, Siliguri. We teach the computer and digital skills people here need: for school and college, for office jobs, for running a shop online, and for building a career in web, ecommerce, marketing or AI."
          />
        </div>
      </section>

      <section>
        <div className="s-container grid gap-10 pb-16 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-[var(--s-body)]">
            <p className="text-lg leading-relaxed text-[var(--s-ink)]">
              Most of our students have never sat a formal computer class before. Many are school students; some are parents; many are
              job seekers who need a recognised diploma. So every course starts where you are, moves at the pace of the batch, and
              is taught at a computer, not a whiteboard.
            </p>
            <p>
              The catalogue runs from CCA, DCA and ADCA — the standard computer-application certificates and diplomas — through to
              specialist programmes in web design, ecommerce, digital marketing and AI prompt engineering. Each has a full-payment
              fee and a monthly plan, and every payment gets a printed receipt.
            </p>
            <p>
              The centre is open Monday to Saturday from 11 AM to 9 PM, so batches fit around school, college and work.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/courses" className="s-btn">
                Browse courses
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--outline">
                Talk to us
              </a>
            </div>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((p, i) => (
                <MediaImage key={p.id} media={p} sizes="(max-width: 1024px) 50vw, 25vw" className={`w-full rounded-xl object-cover ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`} />
              ))}
            </div>
          ) : (
            <PhotoCollage variant="grid" start={1} className="self-start" />
          )}
        </div>
      </section>

      <section className="bg-[var(--s-paper-2)]">
          <div className="s-container py-14 sm:py-20">
            <SectionHeading eyebrow="How we work" title="What you can expect" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v, i) => (
                <div key={v.title} className="s-card p-5">
                  <span className="s-mono text-xs text-[var(--s-accent)]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-lg">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--s-body)]">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      <PhotoMarquee eyebrow="Life at CODE" title="The people behind the reviews" start={2} className="bg-white" />

      <section>
        <div className="s-container py-14 sm:py-20">
          <SectionHeading eyebrow="Reviews" title="In students' words" align="center" />
          <div className="mt-10">
            <GoogleReviews />
          </div>
        </div>
      </section>
    </>
  );
}
