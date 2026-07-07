"use client";

import { useState } from "react";

interface Props {
  shareId: string;
  imageUrl: string;
}

export default function SharePageClient({ shareId, imageUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://removebg.online/s/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      "Background removed in seconds — free, no signup! ✂️\n\nTry it:",
    );
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100">
          Shared Image
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Background removed using AI — free, no signup, no watermark.
        </p>
      </div>

      {/* Image */}
      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-[url('/checkerboard.svg')] bg-repeat">
        <img
          src={imageUrl}
          alt="Background-removed image"
          className="w-full h-auto max-h-[500px] object-contain"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={imageUrl}
          download="background-removed.png"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PNG
        </a>

        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-600 px-5 py-2.5 text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Try It Yourself →
        </a>
      </div>

      {/* Share buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-zinc-500 mr-1">Share:</span>

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
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {copied ? (
            <>
              <svg
                className="h-4 w-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
        This link expires in 24 hours. Want to remove backgrounds yourself?{" "}
        <a href="/" className="text-blue-600 hover:underline">
          removebg.online
        </a>
      </p>
    </div>
  );
}
