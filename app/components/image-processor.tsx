"use client";

import { useEffect, useState, useRef } from "react";
import BeforeAfterSlider from "./before-after-slider";
import BackgroundReplacer from "./background-replacer";
import OutputCompressor from "./output-compressor";
import ImageCropper from "./image-cropper";
import SocialShare from "./social-share";
import AiBackgroundGenerator from "./ai-background-generator";
import MagicEraser from "./magic-eraser";

interface Props {
  imageFile: File | null;
  t: {
    loading: string;
    success: string;
    error: string;
  };
}

type Status = "idle" | "cropping" | "loading" | "done" | "error";
type Tab = "compare" | "background" | "ai-bg" | "magic-eraser" | "compress";

export default function ImageProcessor({ imageFile, t }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Tab>("compare");
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 });
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null);

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
        img.onload = () => {
          setImgDimensions({ w: img.naturalWidth, h: img.naturalHeight });
          resolve();
        };
      });

      const { removeBackground } = await import("@imgly/background-removal");
      setProgress("Processing image...");

      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          setProgress(`${key}: ${Math.round((current / total) * 100)}%`);
        },
      });

      const elapsed = performance.now() - t0;
      setProcessingTimeMs(elapsed);

      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
      setStatus("done");
      setActiveTab("compare");
    } catch (err) {
      console.error("Background removal failed:", err);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!imageFile) return;
    setProcessingTimeMs(null);
    processImage(imageFile);
  }, [imageFile]);

  const handleCropped = (croppedFile: File) => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultBlob(null);
    setOriginalUrl(null);
    processImage(croppedFile);
  };

  const handleResultUpdate = (newUrl: string) => {
    if (resultUrl && resultUrl !== newUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(newUrl);
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!imageFile) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "compare", label: "Compare" },
    { key: "background", label: "Solid BG" },
    { key: "ai-bg", label: "AI BG" },
    { key: "magic-eraser", label: "Magic Eraser" },
    { key: "compress", label: "Compress" },
  ];

  const timeDisplay =
    processingTimeMs !== null
      ? processingTimeMs < 1000
        ? `${Math.round(processingTimeMs)}ms`
        : `${(processingTimeMs / 1000).toFixed(1)}s`
      : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {status === "cropping" && (
        <ImageCropper
          imageFile={imageFile}
          onCropComplete={handleCropped}
          onCancel={() => setStatus("loading")}
        />
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600" />
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">{t.loading}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{progress}</p>
        </div>
      )}

      {status === "done" && resultUrl && originalUrl && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              &#x2713; {t.success}
            </p>
            {timeDisplay && (
              <span className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Done in {timeDisplay}
              </span>
            )}
          </div>

          {/* Tab bar */}
          <div className="flex justify-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 w-fit mx-auto overflow-x-auto max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "compare" && (
            <div className="space-y-4">
              <BeforeAfterSlider originalUrl={originalUrl} resultUrl={resultUrl} />

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setStatus("cropping")}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-600 px-5 py-2.5 text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Crop & Retry
                </button>
                <a
                  href={resultUrl}
                  download="background-removed.png"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG
                </a>
              </div>

              <SocialShare resultUrl={resultUrl} processingTimeMs={processingTimeMs} />
            </div>
          )}

          {activeTab === "background" && (
            <BackgroundReplacer
              resultUrl={resultUrl}
              originalWidth={imgDimensions.w}
              originalHeight={imgDimensions.h}
              onDownload={handleDownload}
            />
          )}

          {activeTab === "ai-bg" && (
            <AiBackgroundGenerator
              resultUrl={resultUrl}
              originalWidth={imgDimensions.w}
              originalHeight={imgDimensions.h}
              onResultUpdate={handleResultUpdate}
              onDownload={handleDownload}
            />
          )}

          {activeTab === "magic-eraser" && (
            <MagicEraser
              resultUrl={resultUrl}
              onResultUpdate={handleResultUpdate}
              onDownload={handleDownload}
            />
          )}

          {activeTab === "compress" && (
            <OutputCompressor resultUrl={resultUrl} onDownload={handleDownload} />
          )}
        </div>
      )}

      {status === "error" && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 font-medium">{t.error}</p>
        </div>
      )}
    </div>
  );
}
