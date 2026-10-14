"use client";

import Image from "next/image";
import { useId, useState } from "react";

// Picks an image and resizes it in the browser (longest side ≤ 1600px, WebP or
// JPEG) before it ever reaches the server, so uploads are fast on the centre's
// connection and each stored image stays small. Exposes the result through
// hidden inputs in the enclosing <form>: `<name>`, `<name>_width`, `<name>_height`.

export const MAX_SIDE = 1600;

export async function resizeImage(file: File): Promise<{ file: File; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const keepPng = file.type === "image/png";
  const type = keepPng ? "image/webp" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  if (!blob) throw new Error("Could not process the image");
  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return { file: new File([blob], `${base}.${keepPng ? "webp" : "jpg"}`, { type }), width, height };
}

export function ImagePicker({
  name = "image",
  label = "Image",
  currentUrl,
  onFile,
}: {
  name?: string;
  label?: string;
  currentUrl?: string | null;
  onFile?: (file: File | null) => void;
}) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.files?.[0];
    e.target.value = "";
    if (!raw) return;
    setBusy(true);
    setError(null);
    try {
      const out = await resizeImage(raw);
      setFile(out.file);
      setDims({ width: out.width, height: out.height });
      setPreview(URL.createObjectURL(out.file));
      setRemoved(false);
      onFile?.(out.file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read the image.");
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setFile(null);
    setDims(null);
    setPreview(null);
    setRemoved(true);
    onFile?.(null);
  }

  const shown = preview ?? (removed ? null : currentUrl ?? null);

  return (
    <div>
      <label className="ro-label" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-start gap-3">
        {shown ? (
          <Image src={shown} alt="" width={96} height={72} unoptimized className="h-[4.5rem] w-24 rounded-sm border border-[var(--ro-line-2)] object-cover" />
        ) : (
          <div className="grid h-[4.5rem] w-24 place-items-center rounded-sm border border-dashed border-[var(--ro-line-2)] text-[0.65rem] uppercase tracking-wider text-[var(--ro-ink-2)]">
            No image
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          <input id={id} type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} disabled={busy} className="block w-full text-[0.8rem] file:mr-3 file:rounded-sm file:border file:border-[var(--ro-line-2)] file:bg-[var(--ro-panel)] file:px-2.5 file:py-1.5 file:text-[0.72rem] file:font-semibold file:uppercase file:tracking-wider" />
          <p className="text-[0.72rem] text-[var(--ro-ink-2)]">
            {busy ? "Resizing…" : dims ? `Ready · ${dims.width}×${dims.height}` : "JPEG, PNG or WebP. Resized automatically."}
          </p>
          {(shown || file) && (
            <button type="button" onClick={clear} className="text-[0.72rem] font-semibold uppercase tracking-wider text-[var(--ro-red)]">
              Remove image
            </button>
          )}
          {error && <p className="text-[0.75rem] text-[var(--ro-red)]">{error}</p>}
        </div>
      </div>
      {/* Hidden carriers for the form submission. */}
      <FileCarrier name={name} file={file} />
      <input type="hidden" name={`${name}_width`} value={dims?.width ?? ""} />
      <input type="hidden" name={`${name}_height`} value={dims?.height ?? ""} />
      <input type="hidden" name="remove_image" value={removed && !file ? "1" : ""} />
    </div>
  );
}

// A file input can't be set programmatically, so the resized File is injected
// into the FormData by the submitting form (see useResizedFile). This carrier
// just records which field name to use.
function FileCarrier({ name, file }: { name: string; file: File | null }) {
  return <input type="hidden" name={`${name}_pending`} value={file ? "1" : ""} />;
}

/** Append the resized file to a FormData under `name` before calling a server action. */
export function attachFile(fd: FormData, name: string, file: File | null) {
  fd.delete(name);
  if (file) fd.set(name, file, file.name);
}
