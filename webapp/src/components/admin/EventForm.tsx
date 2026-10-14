"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ro/Icon";
import { ImagePicker, attachFile } from "./ImagePicker";
import { saveEvent } from "@/app/admin/(dashboard)/site-actions";

export type EventRow = {
  id: number;
  title: string;
  description: string;
  startsAt: string; // yyyy-mm-ddThh:mm in IST
  endsAt: string | null;
  venue: string | null;
  isPublished: boolean;
  imageUrl: string | null;
};

export function EventForm({ event, onDone }: { event?: EventRow; onDone?: () => void }) {
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
      const res = await saveEvent(fd);
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
      <input type="hidden" name="id" value={event?.id ?? ""} />
      <div>
        <label className="ro-label">Title *</label>
        <input name="title" required maxLength={160} defaultValue={event?.title} className="ro-input" placeholder="e.g. Free demo class — Web Design" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="ro-label">Starts (IST) *</label>
          <input name="starts_at" type="datetime-local" required defaultValue={event?.startsAt} className="ro-input ro-mono" />
        </div>
        <div>
          <label className="ro-label">Ends (IST)</label>
          <input name="ends_at" type="datetime-local" defaultValue={event?.endsAt ?? ""} className="ro-input ro-mono" />
        </div>
      </div>
      <div>
        <label className="ro-label">Venue</label>
        <input name="venue" maxLength={255} defaultValue={event?.venue ?? ""} className="ro-input" placeholder="Leave blank for 'At the centre'" />
      </div>
      <div>
        <label className="ro-label">Description *</label>
        <textarea name="description" required rows={4} maxLength={4000} defaultValue={event?.description} className="ro-input" placeholder="What happens, who should come, whether seats are limited." />
      </div>
      <ImagePicker currentUrl={event?.imageUrl} onFile={setFile} label="Poster / photo (optional)" />
      <label className="flex items-center gap-2 text-[0.8rem] font-semibold">
        <input type="checkbox" name="is_published" defaultChecked={event?.isPublished ?? true} className="h-4 w-4 accent-[var(--ro-blue)]" />
        Show on the website
      </label>
      {error && (
        <p className="flex items-start gap-2 text-[0.78rem] text-[var(--ro-red)]">
          <Icon name="alert" size={15} /> {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={pending} className="ro-btn ro-btn--primary">
          <Icon name="check" size={15} /> {pending ? "Saving…" : event ? "Save changes" : "Publish event"}
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
