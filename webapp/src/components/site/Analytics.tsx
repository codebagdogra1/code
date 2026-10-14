"use client";

import Script from "next/script";
import { useEffect } from "react";
import { trackPixel } from "@/components/site/MetaPixel";

// Google tag (gtag.js) for the public site, exactly as issued by Google
// Analytics, plus enquiry measurement. The business's conversion is a tap on
// WhatsApp, the phone number or the email address, not a form submit, so those
// taps are the events worth counting: GA4 `contact_click` and Meta Pixel
// `Contact`. Page views, including client-side navigations, are handled by
// GA4's own enhanced measurement.

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

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WCTDWGECN7" />
      <Script id="google-tag">
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WCTDWGECN7');`}
      </Script>
    </>
  );
}
