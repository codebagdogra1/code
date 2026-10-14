import type { PublicOffer } from "@/lib/content";
import { formatLongDate } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import { MediaImage } from "./MediaImage";

export function OfferCard({ offer, featured = false }: { offer: PublicOffer; featured?: boolean }) {
  return (
    <article
      className={`s-card s-card--lift relative flex flex-col overflow-hidden ${featured ? "md:flex-row" : ""}`}
    >
      {offer.image && (
        <div className={featured ? "md:w-2/5" : ""}>
          <MediaImage media={offer.image} className="h-52 w-full object-cover md:h-full" sizes="(max-width: 768px) 100vw, 40vw" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {offer.highlight && (
          <span className="s-chip w-fit bg-[var(--s-accent)] text-white">{offer.highlight}</span>
        )}
        <h3 className="mt-3 text-xl">{offer.title}</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--s-body)]">{offer.description}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--s-line)] pt-4">
          <p className="s-mono text-xs text-[var(--s-muted)]">
            {offer.validUntil ? `Valid till ${formatLongDate(offer.validUntil)}` : "Limited period offer"}
          </p>
          <a
            href={whatsappLink(`the offer "${offer.title}"`)}
            target="_blank"
            rel="noopener noreferrer"
            className="s-btn s-btn--accent s-btn--sm"
          >
            Claim on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
