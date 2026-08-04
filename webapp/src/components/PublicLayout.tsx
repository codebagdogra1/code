import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";

// Wraps every public marketing page in the `.edu` visual world (EduSmart look —
// see globals.css) and gives them a shared header, footer and floating WhatsApp
// button. Admin pages never use this, so they keep the Records Office styling.
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="edu flex min-h-full flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
