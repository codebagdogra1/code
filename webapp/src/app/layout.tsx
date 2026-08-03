import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Archivo } from "next/font/google";
import "./globals.css";

// Inter is the public site's typeface; self-hosted by next/font so there's no
// Google Fonts CDN request blocking first paint.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Archivo — an industrial grotesque — is the voice of the admin "Records Office"
// world: label plates, headings, and body. Scoped to the admin subtree via `.ro`.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Monospace for receipt numbers, rupee figures, and the punch-card month grid —
// tabular numerals so money lines up in columns.
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CODE — Course Registration",
  description: "Enroll in CODE courses and manage registrations & payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
