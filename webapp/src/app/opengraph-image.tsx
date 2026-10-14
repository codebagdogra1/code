import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ADDRESS_LINES, PHONE_DISPLAY, TAGLINE } from "@/lib/site";

// Branded share card for WhatsApp, Facebook and messaging previews. Generated
// at request time; every public route inherits it unless a segment overrides.
export const alt = "CODE — Computer & Digital Excellence, computer training centre in Bagdogra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The "O" mark from the logo (public/og-mark.png), inlined so the card never
// depends on a network fetch. Falls back to a text mark if the file is missing.
async function markDataUrl(): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "og-mark.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const mark = await markDataUrl();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0b1437 0%, #14225c 100%)",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "#ffffff",
              color: "#0b1437",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: -2,
              overflow: "hidden",
            }}
          >
            {mark ? <img src={mark} alt="" width={72} height={72} /> : "C"}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>CODE</div>
            <div style={{ fontSize: 22, opacity: 0.8 }}>{TAGLINE}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
            Computer courses in Bagdogra, taught the practical way.
          </div>
          <div style={{ fontSize: 26, opacity: 0.85, maxWidth: 1000 }}>
            CCA · DCA · ADCA · Web Design · Ecommerce · Digital Marketing · AI Prompt Engineering
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid rgba(255,255,255,0.18)",
            paddingTop: 24,
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", opacity: 0.85 }}>
            <div>{ADDRESS_LINES[0]}</div>
            <div>{ADDRESS_LINES.slice(1).join(", ")}</div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "14px 26px",
              borderRadius: 999,
              background: "#d93a14",
              fontWeight: 700,
            }}
          >
            {PHONE_DISPLAY}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
