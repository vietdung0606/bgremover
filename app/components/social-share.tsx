"use client";

import { useState } from "react";

interface Props {
  resultUrl: string | null;
  processingTimeMs: number | null;
}

export default function SocialShare({ resultUrl, processingTimeMs }: Props) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink || window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCreateShareLink = async () => {
    if (!resultUrl) return;
    setSharing(true);
    try {
      const resp = await fetch(resultUrl);
      const blob = await resp.blob();
      const formData = new FormData();
      formData.append("image", blob, "shared-image.png");

      const res = await fetch("/api/share", { method: "POST", body: formData });
      const data = await res.json();
      if (data.shareUrl) {
        setShareLink(`https://removebg.online${data.shareUrl}`);
      }
    } catch (err) {
      console.error("Failed to create share link:", err);
    }
    setSharing(false);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Just removed an image background in ${processingTimeMs ? (processingTimeMs / 1000).toFixed(1) + "s" : "seconds"} — free, no signup, no watermark! 🔥\n\nTry it:`,
    );
    const url = encodeURIComponent(shareLink || window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-3">
      {/* Share link row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handleCreateShareLink}
          disabled={sharing || !resultUrl}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
        >
          {sharing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating...
            </>
          ) : shareLink ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Link Ready!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Create Share Link
            </>
          )}
        </button>

        {shareLink && (
          <>
            <input
              type="text"
              value={shareLink}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="px-3 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-300 w-64 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </>
        )}
      </div>

      {/* Social share buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-1">Share:</span>

        <button
          onClick={handleShareTwitter}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Twitter
        </button>

        <button
          onClick={handleShareFacebook}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1877F2] text-white text-sm font-medium hover:bg-[#166fe5] transition-colors"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>
      </div>
    </div>
  );
}
