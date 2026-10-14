"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

// Server actions for the website-content screens (offers, events, gallery,
// enquiries). Each one re-checks the admin session, writes, then revalidates
// the public pages that show the data so the site updates immediately.

export type ActionResult = { ok: true; id?: number } | { ok: false; error: string };

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

function fail(error: string): ActionResult {
  return { ok: false, error };
}

function str(fd: FormData, key: string, max = 2000): string {
  return String(fd.get(key) ?? "").trim().slice(0, max);
}
function int(fd: FormData, key: string, fallback = 0): number {
  const n = Number(fd.get(key));
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}
function dateOnly(fd: FormData, key: string): Date | null {
  const v = str(fd, key, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  return new Date(`${v}T00:00:00.000Z`);
}
// datetime-local values are entered in the centre's timezone (IST, +05:30).
function dateTimeIST(fd: FormData, key: string): Date | null {
  const v = str(fd, key, 16);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return null;
  const d = new Date(`${v}:00+05:30`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function revalidateSite() {
  for (const p of ["/", "/offers", "/events", "/gallery", "/about", "/sitemap.xml"]) revalidatePath(p);
}

// --- media -----------------------------------------------------------------

async function storeImage(fd: FormData, field = "image"): Promise<number | null> {
  const file = fd.get(field);
  if (!(file instanceof File) || file.size === 0) return null;
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Only JPEG, PNG or WebP images are allowed.");
  if (file.size > MAX_BYTES) throw new Error("Image is too large after resizing (max 2 MB).");
  const width = int(fd, `${field}_width`);
  const height = int(fd, `${field}_height`);
  if (width <= 0 || height <= 0) throw new Error("Image dimensions are missing.");
  const data = Buffer.from(await file.arrayBuffer());
  const media = await prisma.siteMedia.create({
    data: {
      filename: file.name.slice(0, 255) || "image",
      mimeType: file.type,
      size: data.length,
      width,
      height,
      alt: str(fd, `${field}_alt`, 255) || null,
      data,
    },
    select: { id: true },
  });
  return media.id;
}

async function deleteMediaIfOrphan(mediaId: number | null | undefined) {
  if (!mediaId) return;
  const [g, o, e] = await Promise.all([
    prisma.galleryImage.count({ where: { mediaId } }),
    prisma.offer.count({ where: { mediaId } }),
    prisma.siteEvent.count({ where: { mediaId } }),
  ]);
  if (g + o + e === 0) await prisma.siteMedia.delete({ where: { id: mediaId } }).catch(() => undefined);
}

// --- offers ----------------------------------------------------------------

export async function saveOffer(fd: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = int(fd, "id");
    const title = str(fd, "title", 160);
    const description = str(fd, "description", 4000);
    if (!title || !description) return fail("Title and description are required.");

    const newMediaId = await storeImage(fd);
    const removeImage = fd.get("remove_image") === "1";
    const data = {
      title,
      highlight: str(fd, "highlight", 60) || null,
      description,
      validFrom: dateOnly(fd, "valid_from"),
      validUntil: dateOnly(fd, "valid_until"),
      isActive: fd.get("is_active") === "on",
      sortOrder: int(fd, "sort_order"),
    };

    let oldMediaId: number | null = null;
    let savedId: number;
    if (id > 0) {
      const existing = await prisma.offer.findUnique({ where: { id }, select: { mediaId: true } });
      if (!existing) return fail("Offer not found.");
      oldMediaId = existing.mediaId;
      const mediaId = newMediaId ?? (removeImage ? null : existing.mediaId);
      await prisma.offer.update({ where: { id }, data: { ...data, mediaId } });
      savedId = id;
      if ((newMediaId || removeImage) && oldMediaId && oldMediaId !== mediaId) await deleteMediaIfOrphan(oldMediaId);
    } else {
      const created = await prisma.offer.create({ data: { ...data, mediaId: newMediaId }, select: { id: true } });
      savedId = created.id;
    }
    revalidateSite();
    revalidatePath("/admin/offers");
    return { ok: true, id: savedId };
  } catch (error) {
    console.error("[site-actions] saveOffer", error);
    return fail(error instanceof Error ? error.message : "Could not save the offer.");
  }
}

export async function deleteOffer(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await prisma.offer.delete({ where: { id }, select: { mediaId: true } });
    await deleteMediaIfOrphan(existing.mediaId);
    revalidateSite();
    revalidatePath("/admin/offers");
    return { ok: true };
  } catch (error) {
    console.error("[site-actions] deleteOffer", error);
    return fail("Could not delete the offer.");
  }
}

export async function toggleOffer(id: number, isActive: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.offer.update({ where: { id }, data: { isActive } });
    revalidateSite();
    revalidatePath("/admin/offers");
    return { ok: true };
  } catch {
    return fail("Could not update the offer.");
  }
}

// --- events ----------------------------------------------------------------

export async function saveEvent(fd: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = int(fd, "id");
    const title = str(fd, "title", 160);
    const description = str(fd, "description", 4000);
    const startsAt = dateTimeIST(fd, "starts_at");
    const endsAt = dateTimeIST(fd, "ends_at");
    if (!title || !description) return fail("Title and description are required.");
    if (!startsAt) return fail("A start date and time is required.");
    if (endsAt && endsAt < startsAt) return fail("End time must be after the start time.");

    const newMediaId = await storeImage(fd);
    const removeImage = fd.get("remove_image") === "1";
    const data = {
      title,
      description,
      startsAt,
      endsAt,
      venue: str(fd, "venue", 255) || null,
      isPublished: fd.get("is_published") === "on",
    };

    let savedId: number;
    if (id > 0) {
      const existing = await prisma.siteEvent.findUnique({ where: { id }, select: { mediaId: true } });
      if (!existing) return fail("Event not found.");
      const mediaId = newMediaId ?? (removeImage ? null : existing.mediaId);
      await prisma.siteEvent.update({ where: { id }, data: { ...data, mediaId } });
      savedId = id;
      if ((newMediaId || removeImage) && existing.mediaId && existing.mediaId !== mediaId) await deleteMediaIfOrphan(existing.mediaId);
    } else {
      const created = await prisma.siteEvent.create({ data: { ...data, mediaId: newMediaId }, select: { id: true } });
      savedId = created.id;
    }
    revalidateSite();
    revalidatePath("/admin/events");
    return { ok: true, id: savedId };
  } catch (error) {
    console.error("[site-actions] saveEvent", error);
    return fail(error instanceof Error ? error.message : "Could not save the event.");
  }
}

export async function deleteEvent(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await prisma.siteEvent.delete({ where: { id }, select: { mediaId: true } });
    await deleteMediaIfOrphan(existing.mediaId);
    revalidateSite();
    revalidatePath("/admin/events");
    return { ok: true };
  } catch (error) {
    console.error("[site-actions] deleteEvent", error);
    return fail("Could not delete the event.");
  }
}

export async function toggleEvent(id: number, isPublished: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.siteEvent.update({ where: { id }, data: { isPublished } });
    revalidateSite();
    revalidatePath("/admin/events");
    return { ok: true };
  } catch {
    return fail("Could not update the event.");
  }
}

// --- gallery ---------------------------------------------------------------

export async function addGalleryImage(fd: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const mediaId = await storeImage(fd);
    if (!mediaId) return fail("Choose an image to upload.");
    const last = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } });
    const created = await prisma.galleryImage.create({
      data: {
        mediaId,
        caption: str(fd, "caption", 255) || null,
        sortOrder: (last._max.sortOrder ?? 0) + 1,
      },
      select: { id: true },
    });
    revalidateSite();
    revalidatePath("/admin/gallery");
    return { ok: true, id: created.id };
  } catch (error) {
    console.error("[site-actions] addGalleryImage", error);
    return fail(error instanceof Error ? error.message : "Could not upload the image.");
  }
}

export async function updateGalleryImage(id: number, patch: { caption?: string; isPublished?: boolean; sortOrder?: number }): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(patch.caption !== undefined ? { caption: patch.caption.trim().slice(0, 255) || null } : {}),
        ...(patch.isPublished !== undefined ? { isPublished: patch.isPublished } : {}),
        ...(patch.sortOrder !== undefined ? { sortOrder: Math.trunc(patch.sortOrder) } : {}),
      },
    });
    revalidateSite();
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch {
    return fail("Could not update the photo.");
  }
}

export async function reorderGallery(ids: number[]): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.$transaction(ids.map((id, i) => prisma.galleryImage.update({ where: { id }, data: { sortOrder: i + 1 } })));
    revalidateSite();
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch {
    return fail("Could not reorder the gallery.");
  }
}

export async function deleteGalleryImage(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    const row = await prisma.galleryImage.delete({ where: { id }, select: { mediaId: true } });
    await deleteMediaIfOrphan(row.mediaId);
    revalidateSite();
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch {
    return fail("Could not delete the photo.");
  }
}

// --- enquiries -------------------------------------------------------------

const ENQUIRY_STATUSES = new Set(["NEW", "CONTACTED", "CLOSED"]);

export async function updateEnquiry(id: number, patch: { status?: string; notes?: string }): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (patch.status !== undefined && !ENQUIRY_STATUSES.has(patch.status)) return fail("Unknown status.");
    await prisma.enquiry.update({
      where: { id },
      data: {
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.notes !== undefined ? { notes: patch.notes.trim().slice(0, 4000) || null } : {}),
      },
    });
    revalidatePath("/admin/enquiries");
    return { ok: true };
  } catch {
    return fail("Could not update the enquiry.");
  }
}

export async function deleteEnquiry(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.enquiry.delete({ where: { id } });
    revalidatePath("/admin/enquiries");
    return { ok: true };
  } catch {
    return fail("Could not delete the enquiry.");
  }
}
