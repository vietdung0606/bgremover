"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Props {
  resultUrl: string;
  onResultUpdate: (url: string) => void;
  onDownload: (url: string, filename: string) => void;
}

export default function MagicEraser({ resultUrl, onResultUpdate, onDownload }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [isErasing, setIsErasing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const histRef = useRef<ImageData[]>([]);

  useEffect(() => {
    const img = new Image();
    img.src = resultUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      saveState(ctx);
      setHasChanges(false);
    };
  }, [resultUrl]);

  const saveState = (ctx?: CanvasRenderingContext2D) => {
    const c = ctx || canvasRef.current?.getContext("2d");
    if (!c) return;
    const data = c.getImageData(0, 0, c.canvas.width, c.canvas.height);
    histRef.current.push(data);
    if (histRef.current.length > 20) histRef.current.shift();
  };

  const undo = () => {
    if (histRef.current.length <= 1) return;
    histRef.current.pop();
    const prev = histRef.current[histRef.current.length - 1];
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !prev) return;
    ctx.putImageData(prev, 0, 0);
    setHasChanges(true);
  };

  const getCanvasPos = useCallback(
    (clientX: number, clientY: number) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const scaleX = (imgRef.current?.naturalWidth || 500) / rect.width;
      const scaleY = (imgRef.current?.naturalHeight || 500) / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const erase = useCallback(
    (clientX: number, clientY: number) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const { x, y } = getCanvasPos(clientX, clientY);
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      setHasChanges(true);
    },
    [brushSize, getCanvasPos],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) saveState(ctx);
    setIsErasing(true);
    erase(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isErasing) return;
    erase(e.clientX, e.clientY);
  };

  const handlePointerUp = () => setIsErasing(false);

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onResultUpdate(dataUrl);
    setHasChanges(false);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    histRef.current = [];
    saveState(ctx);
    setHasChanges(false);
  };

  const handleDownload = () => {
    const dataUrl = canvasRef.current?.toDataURL("image/png");
    if (dataUrl) onDownload(dataUrl, "magic-erased.png");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 text-center">
        Click and drag to erase unwanted areas from your image
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">Brush:</span>
          <input
            type="range"
            min={5}
            max={100}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 h-2 accent-blue-600"
          />
          <span className="text-xs text-zinc-400 w-8">{brushSize}px</span>
        </div>
        <button
          onClick={undo}
          disabled={histRef.current.length <= 1}
          className="px-3 py-1.5 rounded-full text-sm border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
        >
          ↩ Undo
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-full text-sm border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Canvas */}
      <div
        className="rounded-xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-[url('/checkerboard.svg')] bg-repeat cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        <canvas ref={canvasRef} className="w-full h-auto max-h-96 object-contain" />
      </div>

      {/* Brush preview indicator */}
      <div className="flex justify-center items-center gap-3">
        <div
          className="rounded-full border-2 border-blue-500 bg-blue-500/20"
          style={{ width: Math.min(brushSize, 60), height: Math.min(brushSize, 60) }}
        />
        <span className="text-xs text-zinc-400">Brush preview</span>
      </div>

      <div className="flex justify-center gap-3">
        {hasChanges && (
          <button
            onClick={handleApply}
            className="px-5 py-2.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Apply Changes
          </button>
        )}
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-white font-semibold hover:bg-blue-700 transition-colors"
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
