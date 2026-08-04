// Single source of truth for CODE's public contact details, reused across the
// marketing site (header CTA, footer, contact page, course cards). Enrollment
// happens over phone/WhatsApp — the public site no longer has a /register page;
// only the admin area registers students.

export const PHONE_DISPLAY = "+91 96358 09537";
export const PHONE_TEL = "+919635809537";
export const WHATSAPP_NUMBER = "919635809537";
export const EMAIL = "code.bagdogra@gmail.com";
export const ADDRESS = "Lokenath Nagar, Bagdogra, West Bengal 734014";
export const HOURS = "Mon-Sat, 11:00 AM - 9:00 PM";

// Pre-filled WhatsApp enquiry link. Pass a course/topic to seed the message.
export function whatsappLink(topic?: string): string {
  const text = topic
    ? `Hi CODE, I'm interested in ${topic}. Please share the details.`
    : "Hi CODE, I'd like to know more about your courses.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
