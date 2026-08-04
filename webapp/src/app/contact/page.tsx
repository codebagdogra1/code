import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — CODE",
  description: "Get in touch with CODE about courses, admissions and payment plans.",
};

const DETAILS = [
  { label: "Visit us", value: "CODE Institute, Sevoke Road, Siliguri, West Bengal 734001", icon: "⌂" },
  { label: "Call us", value: "+91 00000 00000", icon: "☎" },
  { label: "Email us", value: "hello@thecode.institute", icon: "✉" },
  { label: "Hours", value: "Mon–Sat, 10:00 AM – 7:00 PM", icon: "◷" },
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-[var(--navy-900)] text-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-20">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Questions about a course, admissions, or payment plans? Send us a message and our
              team will get back to you.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            {/* Details */}
            <div>
              <h2 className="text-xl font-semibold">Contact details</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Reach us directly or drop by the campus.
              </p>
              <ul className="mt-8 space-y-6">
                {DETAILS.map((d) => (
                  <li key={d.label} className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--brand)] text-lg text-[var(--accent)]">
                      {d.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{d.label}</p>
                      <p className="mt-0.5 text-sm text-[var(--muted)]">{d.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-xl font-semibold">Send us a message</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                We usually respond within one business day.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
