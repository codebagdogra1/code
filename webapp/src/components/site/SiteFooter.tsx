import Link from "next/link";
import { Logo } from "./Logo";
import { GoogleBadge } from "@/components/site/GoogleBadge";
import { getGoogleReviews } from "@/lib/google-reviews";
import {
  ADDRESS_LINES,
  EMAIL,
  HOURS,
  HOURS_CLOSED,
  ONE_LINER,
  PHONE_DISPLAY,
  PHONE_TEL,
  whatsappLink,
} from "@/lib/site";

const LINKS = [
  { href: "/courses", label: "All courses" },
  { href: "/offers", label: "Current offers" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About the centre" },
  { href: "/contact", label: "Contact & directions" },
];

export async function SiteFooter() {
  const google = await getGoogleReviews();
  return (
    <footer className="s-grid--dark mt-auto text-white/80">
      <div className="s-container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="inline-block rounded-xl bg-white px-4 py-3">
            <Logo className="h-9 w-auto" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{ONE_LINER}</p>
          <GoogleBadge size="sm" tone="dark" rating={google.rating} count={google.count} href={google.mapsUrl} className="mt-5" />
        </div>

        <div>
          <p className="s-eyebrow s-eyebrow--light">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="s-eyebrow s-eyebrow--light">Visit</p>
          <address className="mt-4 not-italic text-sm leading-relaxed">
            {ADDRESS_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-3 text-sm">
            {HOURS}
            <span className="block text-white/60">{HOURS_CLOSED}</span>
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <a href={`tel:${PHONE_TEL}`} className="hover:text-white">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-white">
                {EMAIL}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="s-container py-5 text-xs text-white/60">
          <p>© {new Date().getFullYear()} CODE — Computer &amp; Digital Excellence, Bagdogra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
