import { GOOGLE_MAPS_URL, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "@/lib/site";

// Google brand colours (the "G" mark and star yellow as Google uses them).
export const GOOGLE_STAR = "#fbbc04";
const G_BLUE = "#4285f4";
const G_RED = "#ea4335";
const G_YELLOW = "#fbbc05";
const G_GREEN = "#34a853";

/** The four-colour Google "G" mark. */
export function GoogleG({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <path fill={G_RED} d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill={G_BLUE} d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill={G_YELLOW} d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill={G_GREEN} d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** "Google" wordmark in the brand's letter colours. */
export function GoogleWordmark({ className = "" }: { className?: string }) {
  const letters: [string, string][] = [
    ["G", G_BLUE],
    ["o", G_RED],
    ["o", G_YELLOW],
    ["g", G_BLUE],
    ["l", G_GREEN],
    ["e", G_RED],
  ];
  return (
    <span className={`inline-flex font-semibold tracking-tight ${className}`} style={{ fontFamily: "var(--font-inter), Arial, sans-serif" }} aria-label="Google">
      {letters.map(([ch, color], i) => (
        <span key={i} style={{ color }} aria-hidden>
          {ch}
        </span>
      ))}
    </span>
  );
}

/** Five stars, filled to `rating` (supports halves). */
export function Stars({ rating = 5, size = 16, className = "", label }: { rating?: number; size?: number; className?: string; label?: string }) {
  const r = Math.max(0, Math.min(5, rating));
  return (
    <span className={`inline-flex items-center gap-[2px] ${className}`} role="img" aria-label={label ?? `${r.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, r - i));
        const id = `g-star-${size}-${i}-${Math.round(fill * 100)}`;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
            {fill > 0 && fill < 1 && (
              <defs>
                <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={fill} stopColor={GOOGLE_STAR} />
                  <stop offset={fill} stopColor="#d9dde6" />
                </linearGradient>
              </defs>
            )}
            <path
              fill={fill >= 1 ? GOOGLE_STAR : fill <= 0 ? "#d9dde6" : `url(#${id})`}
              d="M12 2.5l2.95 6.26 6.85.86-5.04 4.73 1.3 6.78L12 17.77l-6.06 3.36 1.3-6.78L2.2 9.62l6.85-.86z"
            />
          </svg>
        );
      })}
    </span>
  );
}

type BadgeProps = {
  rating?: string | number;
  count?: number;
  href?: string;
  /** lg: hero card · md: section header · sm: compact pill */
  size?: "lg" | "md" | "sm";
  /** dark: sits on the navy ground (white card / glass pill) · light: on paper */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Google rating badge, styled the way Google presents a business rating:
 * "G" mark, Google wordmark, big score, gold stars, review count. It is a
 * link to the live listing so a local visitor can verify it in one tap.
 */
export function GoogleBadge({ rating = GOOGLE_RATING, count = GOOGLE_REVIEW_COUNT, href = GOOGLE_MAPS_URL, size = "md", tone = "light", className = "" }: BadgeProps) {
  const score = typeof rating === "number" ? rating.toFixed(1) : rating;
  const numeric = Number.parseFloat(score) || 5;
  const label = `Google rating ${score} out of 5 from ${count} reviews. Opens Google Maps in a new tab.`;

  if (size === "sm") {
    const dark = tone === "dark";
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`inline-flex items-center gap-2.5 rounded-full border py-1.5 pl-2 pr-3.5 text-xs font-semibold transition-colors ${
          dark ? "border-white/20 bg-white/5 text-white hover:bg-white/10" : "border-[var(--s-line)] bg-white text-[var(--s-ink)] hover:border-[var(--s-ink)]"
        } ${className}`}
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white">
          <GoogleG size={14} />
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-bold leading-none">{score}</span>
          <Stars rating={numeric} size={12} label="" />
          <span className={dark ? "text-white/70" : "text-[var(--s-muted)]"}>{count} Google reviews</span>
        </span>
      </a>
    );
  }

  const lg = size === "lg";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group inline-flex max-w-full items-center gap-4 rounded-2xl border border-[var(--s-line)] bg-white text-[var(--s-ink)] shadow-[var(--s-shadow-lg)] transition-transform hover:-translate-y-0.5 ${
        lg ? "px-5 py-4 sm:gap-5 sm:px-6 sm:py-5" : "px-4 py-3"
      } ${className}`}
    >
      <span className={`grid shrink-0 place-items-center rounded-xl bg-[#f8f9fa] ${lg ? "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" : "h-12 w-12"}`}>
        <GoogleG size={lg ? 40 : 28} />
      </span>

      <span className="min-w-0">
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <GoogleWordmark className={lg ? "text-lg sm:text-xl" : "text-base"} />
          <span className={`font-medium text-[#5f6368] ${lg ? "text-sm sm:text-base" : "text-sm"}`}>Rating</span>
        </span>
        <span className="mt-0.5 flex items-center gap-2.5">
          <span className={`s-display font-bold leading-none ${lg ? "text-4xl sm:text-[2.75rem]" : "text-2xl"}`}>{score}</span>
          <Stars rating={numeric} size={lg ? 22 : 16} label="" />
        </span>
        <span className={`mt-1 block text-[#5f6368] ${lg ? "text-sm" : "text-xs"}`}>
          Based on <strong className="font-semibold text-[var(--s-ink)]">{count} reviews</strong>
          <span className="ml-1 hidden text-[#1a73e8] group-hover:underline sm:inline">· See reviews on Google</span>
        </span>
      </span>
    </a>
  );
}
