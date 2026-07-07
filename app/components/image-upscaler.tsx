"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Props {
  resultUrl: string;
  onDownload: (url: string, filename: string) => void;
}

const SCALE_OPTIONS = [
  { label: "2x", value: 2 },
  { label: "3x", value: 3 },
  { label: "4x", value: 4 },
];

export default function ImageUpscaler({ resultUrl, onDownload }: Props) {
  const [scale, setScale] = useState(2);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0, upW: 0, upH: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = resultUrl;
    img.onload = () => {
      imgRef.current = img;
      setDims({
        w: img.naturalWidth,
        h: img.naturalHeight,
        upW: img.naturalWidth * scale,
        upH: img.naturalHeight * scale,
      });
    };
  }, [resultUrl, scale]);

  const handleUpscale = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;

    setProcessing(true);
    requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setUpscaledUrl(canvas.toDataURL("image/png"));
      setProcessing(false);
    });
  }, [scale]);

  const handleDownload = () => {
    if (upscaledUrl) onDownload(upscaledUrl, `upscaled-${scale}x.png`);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 text-center">
        Increase image resolution with high-quality bicubic upscaling
      </p>

      {/* Scale selector */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-zinc-500">Scale:</span>
        {SCALE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setScale(opt.value);
              setUpscaledUrl(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              scale === opt.value
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Dimensions info */}
      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 space-y-1">
        <p>
          Original:{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {dims.w} × {dims.h} px
          </span>
        </p>
        <p>
          Upscaled ({scale}x):{" "}
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {dims.upW} × {dims.upH} px
          </span>
        </p>
      </div>

      {/* Process button */}
      <div className="flex justify-center">
        <button
          onClick={handleUpscale}
          disabled={processing}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {processing ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Upscaling...
            </>
          ) : (
            <>
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
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              Upscale to {scale}x
            </>
          )}
        </button>
      </div>

      {/* Preview */}
      {upscaledUrl && (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-[url('/checkerboard.svg')] bg-repeat">
            <img
              src={upscaledUrl}
              alt={`Upscaled ${scale}x`}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>

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
              Download {scale}x PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
