"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ro/Icon";
import { EventForm, type EventRow } from "./EventForm";
import { deleteEvent, toggleEvent } from "@/app/admin/(dashboard)/site-actions";

export function EventsManager({ events }: { events: (EventRow & { startsLabel: string; past: boolean })[] }) {
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
        {events.length === 0 && (
          <div className="ro-panel p-8 text-center text-[var(--ro-ink-2)]">No events yet — add a demo class, workshop or certificate day on the right.</div>
        )}
        {events.map((e) => {
          const past = e.past;
          return (
            <div key={e.id} className="ro-panel p-4">
              {editing === e.id ? (
                <EventForm event={e} onDone={() => setEditing(null)} />
              ) : (
                <div className="flex gap-4">
                  {e.imageUrl ? (
                    <Image src={e.imageUrl} alt="" width={96} height={72} unoptimized className="h-[4.5rem] w-24 flex-none rounded-sm border border-[var(--ro-line-2)] object-cover" />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`ro-stamp ${e.isPublished ? (past ? "" : "ro-stamp--paid") : ""}`} style={e.isPublished && !past ? undefined : { color: "var(--ro-ink-2)" }}>
                        {!e.isPublished ? "Hidden" : past ? "Past" : "Upcoming"}
                      </span>
                      <span className="ro-mono text-[0.68rem] text-[var(--ro-ink-2)]">{e.startsLabel}{e.venue ? ` · ${e.venue}` : ""}</span>
                    </div>
                    <p className="mt-1.5 font-semibold">{e.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[0.8rem] text-[var(--ro-ink-2)]">{e.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setEditing(e.id)} className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]">
                        Edit
                      </button>
                      <button type="button" disabled={pending} onClick={() => run(() => toggleEvent(e.id, !e.isPublished))} className="ro-btn ro-btn--ghost px-2.5 py-1 text-[0.72rem]">
                        {e.isPublished ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (confirm(`Delete the event "${e.title}"? This cannot be undone.`)) run(() => deleteEvent(e.id));
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
          );
        })}
      </div>

      <div className="ro-panel h-fit p-5">
        <span className="ro-plate ro-plate--ink mb-4">New event</span>
        <EventForm key={events.length} />
      </div>
    </div>
  );
}
