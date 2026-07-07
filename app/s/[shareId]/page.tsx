import { list, del } from "@vercel/blob";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SharePageClient from "./share-page-client";

interface Props {
  params: Promise<{ shareId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://removebg.online";

  return {
    title: "My Background-Removed Image — removebg.online",
    description:
      "Check out this image with the background removed — free, no signup, AI-powered.",
    openGraph: {
      title: "My Background-Removed Image",
      description:
        "Check out this image with the background removed — free, no signup, AI-powered.",
      type: "website",
      images: [
        {
          url: `${siteUrl}/s/${shareId}/og`,
          width: 1200,
          height: 630,
          alt: "Shared background-removed image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "My Background-Removed Image",
      description:
        "Check out this image with the background removed — free, no signup, AI-powered.",
      images: [`${siteUrl}/s/${shareId}/og`],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { shareId } = await params;

  // Find the image blob
  const { blobs } = await list({ prefix: shareId, limit: 10 });
  const imageBlob = blobs.find(
    (b) =>
      b.pathname.includes(shareId) &&
      (b.pathname.endsWith(".png") ||
        b.pathname.endsWith(".jpg") ||
        b.pathname.endsWith(".jpeg") ||
        b.pathname.endsWith(".webp")),
  );

  // Check expiry from metadata
  const metaBlob = blobs.find((b) => b.pathname === `meta-${shareId}.json`);
  let expired = false;
  if (metaBlob) {
    try {
      const res = await fetch(metaBlob.url);
      const meta = await res.json();
      if (Date.now() > meta.expiresAt) expired = true;
    } catch {
      // metadata unavailable, proceed anyway
    }
  }

  if (!imageBlob || expired) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <SharePageClient shareId={shareId} imageUrl={imageBlob.url} />
    </main>
  );
}
