export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  light = false,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  light?: boolean;
  /** Use "h1" for the page title; every page must have exactly one. */
  as?: "h1" | "h2";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`s-eyebrow ${light ? "s-eyebrow--light" : ""}`}>{eyebrow}</p>
      <Heading className={`mt-3 text-3xl sm:text-4xl ${light ? "text-white" : ""}`}>{title}</Heading>
      {lead && <p className={`mt-3 text-base leading-relaxed sm:text-lg ${light ? "text-white/75" : "text-[var(--s-body)]"}`}>{lead}</p>}
    </div>
  );
}
