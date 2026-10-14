import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public: serve an uploaded image from the database. Rows are immutable (an
// edit uploads a new row), so the response can be cached for a year.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const mediaId = Number(id);
  if (!Number.isInteger(mediaId) || mediaId <= 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const media = await prisma.siteMedia.findUnique({
      where: { id: mediaId },
      select: { data: true, mimeType: true, size: true, filename: true },
    });
    if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return new NextResponse(new Uint8Array(media.data), {
      status: 200,
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": String(media.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${media.filename.replace(/[^\w.-]/g, "_")}"`,
      },
    });
  } catch (error) {
    console.error("[media] failed to load", mediaId, error);
    return NextResponse.json({ error: "Unavailable" }, { status: 500 });
  }
}
