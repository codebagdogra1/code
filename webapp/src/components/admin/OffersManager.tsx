"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ro/Icon";
import { OfferForm, type OfferRow } from "./OfferForm";
import { deleteOffer, toggleOffer } from "@/app/admin/(dashboard)/site-actions";

export function OffersManager({ offers }: { offers: OfferRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      router.refresh();
    });
  }

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-3">
        {error && (
          <p className="flex items-center gap-2 text-[0.78rem] text-[var(--ro-red)]">
            <Icon name="alert" size={15} /> {error}
          </p>
        )}
        {offers.length === 0 && (
          <div className="ro-panel p-8 text-center text-[var(--ro-ink-2)]">No offers yet — publish the first one on the right. It appears on the homepage and /offers.</div>
        )}
        {offers.map((o) => (
          <div key={o.id} className="ro-panel p-4">
            {editing === o.id ? (
              <OfferForm offer={o} onDone={() => setEditing(null)} />
            ) : (
              <div className="flex gap-4">
                {o.imageUrl ? (
                  <Image src={o.imageUrl} alt="" width={96} height={72} unoptimized className="h-[4.5rem] w-24 flex-none rounded-sm border border-[var(--ro-line-2)] object-cover" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`ro-stamp ${o.isActive ? "ro-stamp--paid" : ""}`} style={o.isActive ? undefined : { color: "var(--ro-ink-2)" }}>
                      {o.isActive ? "Live" : "Hidden"}
                    </span>
                    {o.highlight && <span className="ro-mono text-[0.7rem] font-bold text-[var(--ro-red)]">{o.highlight}</span>}
                    <span className="ro-mono text-[0.68rem] text-[var(--ro-ink-2)]">
                      {o.validFrom || o.validUntil ? `${o.validFrom ?? "…"} → ${o.validUntil ?? "no end"}` : "No date limit"} · order {o.sortOrder}
                    </span>
                  </div>
                  <p className="mt-1.5 font-semibold">{o.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[0.8rem] text-[var(--ro-ink-2)]">{o.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setEditing(o.id)} className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]">
                      Edit
                    </button>
                    <button type="button" disabled={pending} onClick={() => run(() => toggleOffer(o.id, !o.isActive))} className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]">
                      {o.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (confirm(`Delete the offer "${o.title}"? This cannot be undone.`)) run(() => deleteOffer(o.id));
                      }}
                      className="ro-btn ro-btn--danger px-2.5 py-1 text-[0.72rem]"
                    >
                      <Icon name="trash" size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="ro-panel h-fit p-5">
        <span className="ro-plate ro-plate--ink mb-4">New offer</span>
        <OfferForm key={offers.length} />
      </div>
    </div>
  );
}
