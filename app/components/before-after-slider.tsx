"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  originalUrl: string;
  resultUrl: string;
}

export default function BeforeAfterSlider({ originalUrl, resultUrl }: Props) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const onMouseDown = useCallback(() => {
    dragging.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) updatePosition(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [updatePosition]);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => updatePosition(e.touches[0].clientX),
    [updatePosition],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 select-none"
      onTouchMove={onTouchMove}
      style={{ aspectRatio: "auto", maxHeight: "500px" }}
    >
      {/* Result (underneath) */}
      <img
        src={resultUrl}
        alt="Background removed"
        className="absolute inset-0 w-full h-full object-contain bg-[url('/checkerboard.svg')] bg-repeat"
        draggable={false}
      />

      {/* Original (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain bg-white dark:bg-zinc-900"
          style={{ minWidth: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
          draggable={false}
        />
      </div>

      {/* Slider line + handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize z-10"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={() => {
          document.body.style.userSelect = "none";
        }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-xl border-2 border-zinc-300">
          <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 text-xs font-medium bg-black/50 text-white px-2 py-1 rounded">
        Original
      </span>
      <span className="absolute top-3 right-3 text-xs font-medium bg-black/50 text-white px-2 py-1 rounded">
        Removed
      </span>
    </div>
  );
}
