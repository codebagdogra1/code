import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { whatsappLink } from "@/lib/site";

export const metadata = { title: "Page not found" };

// App-wide 404, dressed as a public page (admin URLs that miss also land here,
// which is fine — the footer carries the staff sign-in link).
export default function NotFound() {
  return (
    <div className="site flex min-h-screen flex-col">
      <SiteHeader />
      <main className="s-grid flex flex-1 items-center">
        <div className="s-container py-20 text-center">
          <p className="s-eyebrow justify-center">404</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">That page isn&apos;t here.</h1>
          <p className="mx-auto mt-4 max-w-md text-[var(--s-body)]">
            The link may be old. Everything about the centre is a click away below.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="s-btn">
              Go to the homepage
            </Link>
            <Link href="/courses" className="s-btn s-btn--outline">
              See courses
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--accent">
              WhatsApp us
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
