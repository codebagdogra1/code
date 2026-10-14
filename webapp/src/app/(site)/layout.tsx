import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

// Every public page: the `.site` world, shared header/footer, WhatsApp button.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
