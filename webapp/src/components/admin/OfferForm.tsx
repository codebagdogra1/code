"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ro/Icon";
import { ImagePicker, attachFile } from "./ImagePicker";
import { saveOffer } from "@/app/admin/(dashboard)/site-actions";

export type OfferRow = {
  id: number;
  title: string;
  highlight: string | null;
  description: string;
  validFrom: string | null; // yyyy-mm-dd
  validUntil: string | null;
  isActive: boolean;
  sortOrder: number;
  imageUrl: string | null;
};

export function OfferForm({ offer, onDone }: { offer?: OfferRow; onDone?: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    attachFile(fd, "image", file);
    setError(null);
    start(async () => {
      const res = await saveOffer(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
      onDone?.();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <input type="hidden" name="id" value={offer?.id ?? ""} />
      <div>
        <label className="ro-label">Title *</label>
        <input name="title" required maxLength={160} defaultValue={offer?.title} className="ro-input" placeholder="e.g. 10% off admission fee this month" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="ro-label">Badge (short)</label>
          <input name="highlight" maxLength={60} defaultValue={offer?.highlight ?? ""} className="ro-input" placeholder="10% OFF · Free demo · New batch" />
        </div>
        <div>
          <label className="ro-label">Display order</label>
          <input name="sort_order" type="number" defaultValue={offer?.sortOrder ?? 0} className="ro-input ro-mono" />
        </div>
      </div>
      <div>
        <label className="ro-label">Description *</label>
        <textarea name="description" required rows={4} maxLength={4000} defaultValue={offer?.description} className="ro-input" placeholder="What the offer is, who it's for, and how to claim it." />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="ro-label">Valid from</label>
          <input name="valid_from" type="date" defaultValue={offer?.validFrom ?? ""} className="ro-input ro-mono" />
        </div>
        <div>
          <label className="ro-label">Valid until</label>
          <input name="valid_until" type="date" defaultValue={offer?.validUntil ?? ""} className="ro-input ro-mono" />
        </div>
      </div>
      <ImagePicker currentUrl={offer?.imageUrl} onFile={setFile} label="Artwork (optional)" />
      <label className="flex items-center gap-2 text-[0.8rem] font-semibold">
        <input type="checkbox" name="is_active" defaultChecked={offer?.isActive ?? true} className="h-4 w-4 accent-[var(--ro-blue)]" />
        Show on the website
      </label>
      {error && (
        <p className="flex items-start gap-2 text-[0.78rem] text-[var(--ro-red)]">
          <Icon name="alert" size={15} /> {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={pending} className="ro-btn ro-btn--primary">
          <Icon name="check" size={15} /> {pending ? "Saving…" : offer ? "Save changes" : "Publish offer"}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="ro-btn ro-btn--ghost" disabled={pending}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
