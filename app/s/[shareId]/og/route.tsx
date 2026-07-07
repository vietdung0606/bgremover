import { ImageResponse } from "next/og";
import { list } from "@vercel/blob";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> },
) {
  const { shareId } = await params;

  try {
    const { blobs } = await list({ prefix: shareId, limit: 10 });
    const imageBlob = blobs.find(
      (b) =>
        b.pathname.includes(shareId) &&
        (b.pathname.endsWith(".png") ||
          b.pathname.endsWith(".jpg") ||
          b.pathname.endsWith(".jpeg") ||
          b.pathname.endsWith(".webp")),
    );

    if (!imageBlob) {
      return new Response("Image not found", { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
            padding: "40px",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
          }}
        >
          {/* Shared image */}
          <img
            src={imageBlob.url}
            alt="Shared image"
            width={480}
            height={360}
            style={{
              objectFit: "contain",
              borderRadius: "16px",
              marginBottom: "24px",
            }}
          />

          {/* Branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "26px",
              color: "white",
              fontWeight: 600,
            }}
          >
            ✂️ Background removed with removebg.online
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              marginTop: "8px",
            }}
          >
            Free · No signup · No watermark
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch (err) {
    console.error("Share OG generation failed:", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
