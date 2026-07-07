"use client";

import { useEffect, useState, useRef } from "react";
import BeforeAfterSlider from "./before-after-slider";
import SocialShare from "./social-share";

interface Props {
  imageFile: File | null;
  t: {
    loading: string;
    success: string;
    error: string;
  };
}

type Status = "idle" | "loading" | "done" | "error";

export default function ImageProcessor({ imageFile, t }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null);
  const workerRef = useRef<boolean>(false);

  useEffect(() => {
    if (!imageFile) return;
    if (workerRef.current) return;
    workerRef.current = true;

    let cancelled = false;

    const processImage = async (file: File) => {
      setStatus("loading");
      setProgress("Downloading AI model...");
      const t0 = performance.now();

      try {
        const original = URL.createObjectURL(file);
        setOriginalUrl(original);

        const img = new Image();
        img.src = original;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });

        const { removeBackground } = await import("@imgly/background-removal");
        setProgress("Processing image...");

        const blob = await removeBackground(file, {
          progress: (key: string, current: number, total: number) => {
            if (!cancelled) {
              setProgress(`${key}: ${Math.round((current / total) * 100)}%`);
            }
          },
        });

        if (cancelled) return;

        const elapsed = performance.now() - t0;
        setProcessingTimeMs(elapsed);

        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        setStatus("done");
      } catch (err) {
        if (cancelled) return;
        console.error("Background removal failed:", err);
        setStatus("error");
      }
    };

    processImage(imageFile);

    return () => {
      cancelled = true;
    };
  }, [imageFile]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "background-removed.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!imageFile) return null;

  const timeDisplay =
    processingTimeMs !== null
      ? processingTimeMs < 1000
        ? `${Math.round(processingTimeMs)}ms`
        : `${(processingTimeMs / 1000).toFixed(1)}s`
      : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-12 space-y-4">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600" />
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
            {t.loading}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{progress}</p>
        </div>
      )}

      {status === "done" && resultUrl && originalUrl && (
        <>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              &#x2713; {t.success}
            </p>
            {timeDisplay && (
              <span className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Done in {timeDisplay}
              </span>
            )}
          </div>

          <BeforeAfterSlider originalUrl={originalUrl} resultUrl={resultUrl} />

          <div className="flex justify-center">
            <button
              onClick={handleDownload}
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
            </button>
          </div>

          <SocialShare processingTimeMs={processingTimeMs} />
        </>
      )}

      {status === "error" && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 font-medium">{t.error}</p>
          <button
            onClick={() => {
              setStatus("idle");
              workerRef.current = false;
            }}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
