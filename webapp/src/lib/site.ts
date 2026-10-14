// Single source of truth for CODE's public details, reused across the website
// (header, footer, contact page, JSON-LD) and the receipts. Enrolment happens at
// the desk or over phone/WhatsApp — the public site captures enquiries only.

export const BUSINESS_NAME = "CODE — Computer & Digital Excellence";
export const SHORT_NAME = "CODE";
export const TAGLINE = "Computer & Digital Excellence";

export const PHONE_DISPLAY = "+91 96358 09537";
export const PHONE_TEL = "+919635809537";
export const WHATSAPP_NUMBER = "919635809537";
export const EMAIL = "code.bagdogra@gmail.com";

export const STREET_ADDRESS = "Lokenath Nagar Road, near K1 Fitness Gym";
export const LOCALITY = "Bagdogra";
export const DISTRICT = "Siliguri";
export const REGION = "West Bengal";
export const POSTAL_CODE = "734014";
export const COUNTRY_CODE = "IN";
export const ADDRESS = `${STREET_ADDRESS}, ${LOCALITY}, ${DISTRICT}, ${REGION} ${POSTAL_CODE}`;
export const ADDRESS_LINES = [STREET_ADDRESS, `${LOCALITY}, ${DISTRICT}`, `${REGION} ${POSTAL_CODE}`];

export const HOURS = "Mon–Sat, 11:00 AM – 9:00 PM";
export const HOURS_CLOSED = "Sunday closed";
export const OPENS = "11:00";
export const CLOSES = "21:00";

// Map pin for the centre (Google Maps place). The embed uses the plain query
// form so it needs no API key.
export const MAP_LAT = 26.7005581;
export const MAP_LNG = 88.3334188;
export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Computer+and+Digital+Excellence+-+CODE/@26.7005581,88.3334188,17z/data=!3m1!4b1!4m6!3m5!1s0x39e4474778f7c643:0x8d332693e200adc8!8m2!3d26.7005581!4d88.3334188!16s%2Fg%2F11xp0kv4xc";
export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Computer+and+Digital+Excellence+-+CODE,+Bagdogra&output=embed";

// Public Google rating as shown on the Maps listing. Update when it changes.
export const GOOGLE_RATING = "5.0";
export const GOOGLE_REVIEW_COUNT = 43;

// Pre-filled WhatsApp enquiry link. Pass a course/topic to seed the message.
export function whatsappLink(topic?: string): string {
  const text = topic
    ? `Hi CODE, I'm interested in ${topic}. Please share the details.`
    : "Hi CODE, I'd like to know more about your courses.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// One consistent description of the business, reused verbatim in meta tags,
// JSON-LD, llms.txt and the footer so search and answer engines see one entity.
export const ONE_LINER =
  "CODE — Computer & Digital Excellence is a computer training centre in Bagdogra, Siliguri (West Bengal) teaching CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI prompt engineering in small, hands-on batches with monthly fee plans.";

// Languages classes are explained in. Mirrors the JSON-LD contact point.
export const LANGUAGES = ["Bengali", "Hindi", "English"] as const;
export const LANGUAGE_CODES = ["bn", "hi", "en"] as const;

// Places the centre realistically serves. Used for areaServed in JSON-LD and
// the "areas we serve" copy. Keep to genuine commuting distance.
export const AREAS_SERVED = [
  "Bagdogra",
  "Upper Bagdogra",
  "Bihar More",
  "Gossaipur",
  "Matigara",
  "Naxalbari",
  "Siliguri",
] as const;

// Straight-line distances from the centre (MAP_LAT/MAP_LNG) to landmarks a
// visitor would navigate from. Rounded; computed from public coordinates.
export const LANDMARKS = [
  { name: "Bagdogra railway station", distance: "about 1.5 km" },
  { name: "Bagdogra Airport (IXB)", distance: "about 2 km" },
  { name: "Matigara", distance: "about 5 km" },
  { name: "Siliguri Junction", distance: "about 10 km" },
  { name: "Naxalbari", distance: "about 12 km" },
] as const;

// Verified public profiles of this exact business, for Organization.sameAs.
// Add a URL only after the listing is live and its name, address and phone
// match the strings above byte for byte (see docs/SEO-TODO.md, Owner P1).
export const SAME_AS: string[] = [GOOGLE_MAPS_URL];

// Last significant edit to the static page copy (home, about, contact,
// courses hub). Sent as sitemap lastmod — change it only when words change.
export const SITE_CONTENT_UPDATED = "2026-10-14";
