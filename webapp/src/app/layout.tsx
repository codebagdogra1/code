import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Archivo, Space_Grotesk } from "next/font/google";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

// One root layout for the whole app. The public site (`.site` world), the admin
// Records Office (`.ro` world) and the receipts all hang off this <html>/<body>;
// each world scopes its own tokens in globals.css so they never bleed.

// Inter — body text for the public site and the base UI typeface.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

// Space Grotesk — the public site's display face: geometric, slightly technical,
// fits a computer centre without reading as a generic SaaS landing page.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Archivo — the admin Records Office voice (label plates, headings, body).
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });

// JetBrains Mono — rupee figures and receipt numbers in admin; small technical
// labels ("// 01 courses") on the public site.
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CODE — Computer & Digital Excellence, Bagdogra",
    template: "%s | CODE Bagdogra",
  },
  description:
    "Computer training centre in Bagdogra, Siliguri (West Bengal). CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI prompt engineering courses with monthly fee plans.",
  applicationName: "CODE Bagdogra",
  // Share images come from app/opengraph-image.tsx and app/twitter-image.tsx.
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CODE — Computer & Digital Excellence",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${spaceGrotesk.variable} ${archivo.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
