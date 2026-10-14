import Link from "next/link";
import { Fragment } from "react";
import { Faq } from "@/components/site/Faq";
import type { Block } from "@/lib/guides";

// Renders a guide body. Inline text supports two markdown-style forms so the
// content file stays plain strings: [label](/path) links and **bold**.
const INLINE = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;

export function RichText({ text }: { text: string }) {
  const parts = text.split(INLINE);
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          const internal = href.startsWith("/");
          return internal ? (
            <Link key={i} href={href} className="font-semibold text-[var(--s-ink)] underline decoration-[var(--s-accent)] decoration-2 underline-offset-4 hover:text-[var(--s-accent)]">
              {label}
            </Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
              {label}
            </a>
          );
        }
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i} className="font-semibold text-[var(--s-ink)]">{bold[1]}</strong>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function GuideBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6 text-[var(--s-body)]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={slug(b.text)} className="scroll-mt-28 pt-4 text-2xl text-[var(--s-ink)] sm:text-3xl">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={slug(b.text)} className="scroll-mt-28 text-xl text-[var(--s-ink)]">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="max-w-3xl text-base leading-relaxed sm:text-lg">
                <RichText text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="max-w-3xl space-y-3">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed">
                    <span className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-[var(--s-accent)]" aria-hidden />
                    <span>
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="max-w-3xl space-y-3">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-4 leading-relaxed">
                    <span className="s-mono mt-1 w-6 shrink-0 text-xs text-[var(--s-accent)]">{String(j + 1).padStart(2, "0")}</span>
                    <span>
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="s-card overflow-x-auto">
                <table className="w-full min-w-[36rem] text-sm">
                  {b.caption && <caption className="px-5 pt-4 text-left text-xs uppercase tracking-wide text-[var(--s-muted)]">{b.caption}</caption>}
                  <thead>
                    <tr className="border-b border-[var(--s-line)] text-left text-xs uppercase tracking-wide text-[var(--s-muted)]">
                      {b.head.map((h, j) => (
                        <th key={j} scope="col" className="px-5 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="border-b border-[var(--s-line)] align-top last:border-0">
                        {row.map((cell, j) =>
                          j === 0 ? (
                            <th key={j} scope="row" className="px-5 py-3 text-left font-semibold text-[var(--s-ink)]">
                              <RichText text={cell} />
                            </th>
                          ) : (
                            <td key={j} className="px-5 py-3">
                              <RichText text={cell} />
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout":
            return (
              <p key={i} className="max-w-3xl rounded-[var(--s-radius)] border border-[var(--s-line-2)] bg-[var(--s-paper-2)] px-5 py-4 text-base leading-relaxed text-[var(--s-ink)]">
                <RichText text={b.text} />
              </p>
            );
          case "faq":
            return (
              <div key={i} className="pt-4">
                <h2 id="faq" className="scroll-mt-28 text-2xl text-[var(--s-ink)] sm:text-3xl">
                  Frequently asked questions
                </h2>
                <div className="mt-5">
                  <Faq items={b.items} />
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
