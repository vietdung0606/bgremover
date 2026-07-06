"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface Props {
  resultUrl: string;
  onDownload: (url: string, filename: string) => void;
}

export default function OutputCompressor({ resultUrl, onDownload }: Props) {
  const [quality, setQuality] = useState(92);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [estimatedSize, setEstimatedSize] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = resultUrl;
    img.onload = () => {
      imgRef.current = img;
      compressAndEstimate();
    };
  }, [resultUrl]);

  const compressAndEstimate = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    const mime = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";
    const dataUrl = canvas.toDataURL(mime, quality / 100);
    const base64 = dataUrl.split(",")[1];
    const bytes = (base64.length * 3) / 4;
    setEstimatedSize(bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`);
    // Cache for download
    canvas.dataset.lastDataUrl = dataUrl;
  }, [quality, format]);

  useEffect(() => {
    if (imgRef.current) compressAndEstimate();
  }, [quality, format, compressAndEstimate]);

  const handleDownload = () => {
    const dataUrl = canvasRef.current?.dataset.lastDataUrl;
    if (!dataUrl) return;
    const ext = format === "jpeg" ? "jpg" : format;
    onDownload(dataUrl, `background-removed.${ext}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">Format:</span>
          {(["png", "jpeg", "webp"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                format === f
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-500"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">Quality: {quality}%</span>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-24 h-2 accent-blue-600"
            disabled={format === "png"}
          />
        </div>

        {estimatedSize && (
          <span className="text-sm text-zinc-500">
            Est. size: <span className="font-medium text-zinc-700 dark:text-zinc-300">{estimatedSize}</span>
          </span>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Compressed
        </button>
      </div>
    </div>
  );
}
