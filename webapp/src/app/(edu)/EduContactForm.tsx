"use client";

import { useEffect } from "react";

// The page retains the original EduSmart contact-form design. This small client
// bridge replaces its dead WordPress action with the existing Next.js enquiry
// endpoint, without changing the visual markup or form controls.
export function EduContactForm() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>("form.wpcf7-form");
    if (!form) return;
    const contactForm = form;
    const output = contactForm.querySelector<HTMLElement>(".wpcf7-response-output");

    async function submit(event: SubmitEvent) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const data = new FormData(contactForm);
      if (output) {
        output.textContent = "Sending your enquiry…";
        output.setAttribute("aria-hidden", "false");
      }
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("your-name"),
            email: data.get("your-email"),
            message: data.get("your-message"),
          }),
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error ?? "Unable to send your enquiry. Please try again.");
        contactForm.reset();
        if (output) output.textContent = "Thanks — CODE has received your enquiry.";
      } catch (error) {
        if (output) output.textContent = error instanceof Error ? error.message : "Unable to send your enquiry. Please try again.";
      }
    }

    contactForm.addEventListener("submit", submit);
    return () => contactForm.removeEventListener("submit", submit);
  }, []);

  return null;
}
