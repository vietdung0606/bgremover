"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  resultUrl: string;
  originalWidth: number;
  originalHeight: number;
  onDownload: (url: string, filename: string) => void;
}

const PRESET_COLORS = [
  { label: "Transparent", value: "transparent" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ff0000" },
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#16a34a" },
  { label: "Gray", value: "#6b7280" },
  { label: "Custom", value: "custom" },
];

export default function BackgroundReplacer({
  resultUrl,
  originalWidth,
  originalHeight,
  onDownload,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgColor, setBgColor] = useState("transparent");
  const [customColor, setCustomColor] = useState("#f0f0f0");
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const resultImgRef = useRef<HTMLImageElement | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  // Load result image
  useEffect(() => {
    const img = new Image();
    img.src = resultUrl;
    img.onload = () => {
      resultImgRef.current = img;
      renderCanvas();
    };
  }, [resultUrl]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const fgImg = resultImgRef.current;
    if (!canvas || !fgImg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = fgImg.naturalWidth;
    canvas.height = fgImg.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (bgColor !== "transparent" && !bgImage) {
      ctx.fillStyle = bgColor === "custom" ? customColor : bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (bgImage) {
      // Fill with image pattern
      const scale = Math.max(
        canvas.width / bgImage.naturalWidth,
        canvas.height / bgImage.naturalHeight,
      );
      const dw = bgImage.naturalWidth * scale;
      const dh = bgImage.naturalHeight * scale;
      const dx = (canvas.width - dw) / 2;
      const dy = (canvas.height - dh) / 2;
      ctx.drawImage(bgImage, dx, dy, dw, dh);
    }

    // Draw foreground (result with transparent bg)
    ctx.drawImage(fgImg, 0, 0);
  }, [bgColor, customColor, bgImage]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => setBgImage(img);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ext = bgColor === "transparent" && !bgImage ? "png" : "jpg";
    const mime = ext === "png" ? "image/png" : "image/jpeg";
    const url = canvas.toDataURL(mime, 0.92);
    onDownload(url, `background-removed.${ext}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {PRESET_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => {
              setBgColor(c.value);
              setBgImage(null);
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              bgColor === c.value && !bgImage
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
            }`}
          >
            {c.value === "transparent" ? (
              <span className="inline-block w-4 h-4 rounded mr-1 align-middle bg-[url('/checkerboard.svg')] bg-repeat border border-zinc-300" />
            ) : c.value === "custom" ? (
              "🎨 Custom"
            ) : (
              <span
                className="inline-block w-4 h-4 rounded-full mr-1 align-middle border border-zinc-300"
                style={{ backgroundColor: c.value }}
              />
            )}
            {c.label}
          </button>
        ))}
      </div>

      {bgColor === "custom" && (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="h-10 w-10 rounded cursor-pointer border-0"
          />
          <span className="text-sm text-zinc-500">{customColor}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">
          📷 Upload background image
          <input
            type="file"
            accept="image/*"
            onChange={handleBgImageUpload}
            className="hidden"
          />
        </label>
        {bgImage && (
          <button
            onClick={() => setBgImage(null)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>

      {/* Canvas preview */}
      <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-h-96 object-contain"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}
