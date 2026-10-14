"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Icon } from "@/components/ro/Icon";
import { resizeImage } from "./ImagePicker";
import { addGalleryImage, deleteGalleryImage, reorderGallery, updateGalleryImage } from "@/app/admin/(dashboard)/site-actions";

export type GalleryRow = { id: number; url: string; width: number; height: number; caption: string | null; isPublished: boolean };

export function GalleryManager({ images }: { images: GalleryRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      router.refresh();
    });
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setError(null);
    start(async () => {
      let n = 0;
      for (const raw of files) {
        n += 1;
        setProgress(`Uploading ${n} of ${files.length}…`);
        try {
          const out = await resizeImage(raw);
          const fd = new FormData();
          fd.set("image", out.file, out.file.name);
          fd.set("image_width", String(out.width));
          fd.set("image_height", String(out.height));
          fd.set("image_alt", "CODE computer centre, Bagdogra");
          const res = await addGalleryImage(fd);
          if (!res.ok) setError(res.error);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not process an image.");
        }
      }
      setProgress(null);
      router.refresh();
    });
  }

  function move(index: number, dir: -1 | 1) {
    const ids = images.map((i) => i.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    run(() => reorderGallery(ids));
  }

  return (
    <div className="mt-5">
      <div className="ro-panel flex flex-wrap items-center gap-3 p-4">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={upload} className="hidden" />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={pending} className="ro-btn ro-btn--primary">
          <Icon name="new" size={15} /> Upload photos
        </button>
        <p className="text-[0.78rem] text-[var(--ro-ink-2)]">
          {progress ?? "Select one or many photos. They are resized in your browser before upload and appear on the homepage, About and Gallery pages."}
        </p>
        {error && (
          <p className="flex w-full items-center gap-2 text-[0.78rem] text-[var(--ro-red)]">
            <Icon name="alert" size={15} /> {error}
          </p>
        )}
      </div>

      {images.length === 0 ? (
        <div className="ro-panel mt-4 p-8 text-center text-[var(--ro-ink-2)]">No photos yet. Upload photos of the lab, classes and events.</div>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <li key={img.id} className="ro-panel overflow-hidden">
              <Image src={img.url} alt={img.caption ?? ""} width={img.width} height={img.height} unoptimized className="aspect-[4/3] w-full object-cover" />
              <div className="space-y-2 p-3">
                <input
                  defaultValue={img.caption ?? ""}
                  placeholder="Caption (optional)"
                  maxLength={255}
                  className="ro-input"
                  onBlur={(e) => {
                    if (e.target.value !== (img.caption ?? "")) run(() => updateGalleryImage(img.id, { caption: e.target.value }));
                  }}
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`ro-stamp ${img.isPublished ? "ro-stamp--paid" : ""}`} style={img.isPublished ? undefined : { color: "var(--ro-ink-2)" }}>
                    {img.isPublished ? "Live" : "Hidden"}
                  </span>
                  <span className="flex-1" />
                  <button type="button" disabled={pending || i === 0} onClick={() => move(i, -1)} className="ro-btn ro-btn--ghost px-2 py-1 text-[0.72rem]" aria-label="Move earlier">
                    ←
                  </button>
                  <button type="button" disabled={pending || i === images.length - 1} onClick={() => move(i, 1)} className="ro-btn ro-btn--ghost px-2 py-1 text-[0.72rem]" aria-label="Move later">
                    →
                  </button>
                  <button type="button" disabled={pending} onClick={() => run(() => updateGalleryImage(img.id, { isPublished: !img.isPublished }))} className="ro-btn ro-btn--ghost px-2 py-1 text-[0.72rem]">
                    {img.isPublished ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (confirm("Delete this photo? This cannot be undone.")) run(() => deleteGalleryImage(img.id));
                    }}
                    className="ro-btn ro-btn--danger px-2 py-1 text-[0.72rem]"
                    aria-label="Delete photo"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
