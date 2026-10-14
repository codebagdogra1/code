"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPixel } from "@/components/site/MetaPixel";

// Enquiry measurement for the public site. The business's conversion is a tap
// on WhatsApp, the phone number or the email address, not a form submit, so
// those taps are the events worth counting: GA4 `contact_click` (when a
// measurement ID is configured) and Meta Pixel `Contact` (always, the pixel
// is already on every public page).

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function channelFor(href: string): "whatsapp" | "phone" | "email" | "maps" | null {
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) return "whatsapp";
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (/^https?:\/\/(www\.)?google\.[a-z.]+\/maps/i.test(href) || /maps\.app\.goo\.gl/i.test(href)) return "maps";
  return null;
}

export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  // GA4 page views on client-side navigation (the config call covers the first).
  useEffect(() => {
    if (!GA_ID) return;
    if (first.current) {
      first.current = false;
      return;
    }
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  // One delegated listener: any anchor to WhatsApp / tel / mailto / Maps.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const channel = channelFor(a.href);
      if (!channel) return;
      const params = { channel, page_path: window.location.pathname, link_text: (a.textContent ?? "").trim().slice(0, 80) };
      window.gtag?.("event", "contact_click", params);
      if (channel !== "maps") trackPixel("Contact", { channel });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
