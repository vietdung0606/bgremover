import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Upload to Vercel Blob with 24h cache
    const blob = await put(image.name || "shared-image.png", image, {
      access: "public",
      contentType: image.type || "image/png",
      addRandomSuffix: true,
      cacheControlMaxAge: 86400,
    });

    // Store metadata as JSON alongside the image
    const shareId = blob.pathname.split("/").pop()?.split(".")[0] || crypto.randomUUID();
    const metadata = {
      shareId,
      url: blob.url,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400 * 1000, // 24h
    };

    // Store metadata in a separate blob
    await put(`meta-${shareId}.json`, JSON.stringify(metadata), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      shareId,
      shareUrl: `/s/${shareId}`,
      directUrl: blob.url,
    });
  } catch (err) {
    console.error("Share upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
