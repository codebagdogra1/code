// Decorative line icons (paths from Lucide, ISC licence — lucide.dev) used as
// floating "doodles" around the moments showcase. Purely decorative, so every
// instance is aria-hidden and sits behind pointer events.

const PATHS = {
  sparkles:
    "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0zM20 3v4M22 5h-4M4 17v2M5 18H3",
  rocket:
    "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zm7.5-1.5-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
  cap: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5",
  bulb: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4",
  star: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
  heart: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
  party:
    "M5.8 11.3 2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01m0-18-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10m8 3-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17M11 2l.33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7m2 6c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
  zap: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
  trophy:
    "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z",
  code: "m18 16 4-4-4-4M6 8l-4 4 4 4m8.5-12-5 16",
  smile: "M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
} as const;

export type DoodleName = keyof typeof PATHS;

export function DoodleIcon({
  name,
  size = 28,
  strokeWidth = 2,
  fill = "none",
  className,
}: {
  name: DoodleName;
  size?: number;
  strokeWidth?: number;
  fill?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      {name === "smile" && <circle cx="12" cy="12" r="10" />}
      <path d={PATHS[name]} />
    </svg>
  );
}

type Doodle = {
  name: DoodleName;
  /** Tailwind-free absolute placement (percentages keep it responsive). */
  style: React.CSSProperties;
  size?: number;
  variant?: "float" | "twinkle" | "wobble" | "orbit";
  fill?: boolean;
};

// Positions are relative to the section box. Vars: --c colour, --t duration,
// --delay start offset, --rot resting tilt.
const DOODLES: Doodle[] = [
  { name: "sparkles", size: 34, variant: "twinkle", fill: true, style: { top: "6%", left: "4%", "--c": "var(--s-amber-ink)", "--t": "3.2s" } as React.CSSProperties },
  { name: "rocket", size: 44, variant: "float", style: { top: "12%", right: "5%", "--c": "var(--s-accent)", "--t": "6s", "--rot": "-20deg" } as React.CSSProperties },
  { name: "star", size: 22, variant: "twinkle", fill: true, style: { top: "28%", left: "11%", "--c": "var(--s-accent)", "--t": "2.6s", "--delay": "0.8s" } as React.CSSProperties },
  { name: "cap", size: 40, variant: "wobble", style: { bottom: "18%", left: "3%", "--c": "var(--s-ink-3)", "--t": "5.5s", "--delay": "0.4s" } as React.CSSProperties },
  { name: "bulb", size: 36, variant: "float", style: { top: "46%", right: "3%", "--c": "var(--s-amber-ink)", "--t": "7s", "--delay": "1.2s" } as React.CSSProperties },
  { name: "heart", size: 24, variant: "twinkle", fill: true, style: { bottom: "30%", right: "10%", "--c": "#e0457b", "--t": "3s", "--delay": "1.6s" } as React.CSSProperties },
  { name: "party", size: 38, variant: "wobble", style: { bottom: "8%", right: "4%", "--c": "var(--s-accent)", "--t": "4.5s" } as React.CSSProperties },
  { name: "zap", size: 26, variant: "twinkle", fill: true, style: { top: "62%", left: "7%", "--c": "var(--s-amber-ink)", "--t": "2.2s", "--delay": "0.3s" } as React.CSSProperties },
  { name: "code", size: 30, variant: "float", style: { bottom: "6%", left: "16%", "--c": "var(--s-mint-ink)", "--t": "6.5s", "--delay": "2s", "--rot": "8deg" } as React.CSSProperties },
  { name: "trophy", size: 30, variant: "orbit", style: { top: "4%", left: "48%", "--c": "var(--s-amber-ink)", "--t": "16s" } as React.CSSProperties },
  { name: "smile", size: 28, variant: "float", style: { top: "30%", right: "14%", "--c": "var(--s-mint-ink)", "--t": "5s", "--delay": "0.9s", "--rot": "-10deg" } as React.CSSProperties },
  { name: "sparkles", size: 22, variant: "twinkle", fill: true, style: { bottom: "40%", left: "48%", "--c": "var(--s-accent)", "--t": "2.8s", "--delay": "1.1s" } as React.CSSProperties },
];

const VARIANT_CLASS = {
  float: "s-doodle",
  twinkle: "s-doodle s-doodle--twinkle",
  wobble: "s-doodle s-doodle--wobble",
  orbit: "s-doodle s-doodle--orbit",
} as const;

/** Full-bleed layer of floating doodles. Place inside a `relative` box. */
export function DoodleLayer({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {DOODLES.map((d, i) => (
        <span key={i} className={`${VARIANT_CLASS[d.variant ?? "float"]} hidden sm:block`} style={d.style}>
          <DoodleIcon name={d.name} size={d.size} fill={d.fill ? "currentColor" : "none"} strokeWidth={d.fill ? 1.5 : 2} />
        </span>
      ))}
    </div>
  );
}
