import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { ContactForm } from "@/components/ContactForm";
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, ADDRESS, HOURS, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — CODE",
  description: "Get in touch with CODE about courses, admissions and payment plans.",
};

const DETAILS = [
  { label: "Visit us", value: ADDRESS, icon: "⌂" },
  { label: "Call us", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}`, icon: "☎" },
  { label: "Email us", value: EMAIL, href: `mailto:${EMAIL}`, icon: "✉" },
  { label: "Hours", value: HOURS, icon: "◷" },
];

export default function ContactPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-[var(--edu-tint)] to-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-20">
          <span className="edu-eyebrow mx-auto w-fit">Contact</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--body)]">
            Questions about a course, admissions, or payment plans? Message us on WhatsApp or send a
            note — our team will get right back to you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="edu-btn px-6 py-3"
            >
              Chat on WhatsApp
            </a>
            <a href={`tel:${PHONE_TEL}`} className="edu-btn-outline px-6 py-3">
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* Details */}
          <div>
            <h2 className="text-2xl font-extrabold">Contact details</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Reach us directly or drop by the campus.</p>
            <ul className="mt-8 space-y-6">
              {DETAILS.map((d) => (
                <li key={d.label} className="flex gap-4">
                  <span className="edu-chip h-12 w-12 shrink-0 text-lg">{d.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-[var(--edu-ink)]">{d.label}</p>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="mt-0.5 block text-sm text-[var(--body)] transition-colors hover:text-[var(--edu-primary)]"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm text-[var(--body)]">{d.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-extrabold">Send us a message</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">We usually respond within one business day.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
