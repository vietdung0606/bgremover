"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Props {
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageFile, onCropComplete, onCancel }: Props) {
  const [imageUrl] = useState(() => URL.createObjectURL(imageFile));
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [dragging, setDragging] = useState<"move" | "tl" | "tr" | "bl" | "br" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 500, h: 500 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const maxDim = 500;
      const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight);
      setImgSize({ w: img.naturalWidth * scale, h: img.naturalHeight * scale });
      const size = Math.min(imgSize.w, imgSize.h) * 0.8;
      const x = (imgSize.w - size) / 2;
      const y = (imgSize.h - size) / 2;
      setCrop({ x, y, w: size, h: size });
    };
  }, [imageUrl]);

  const getPos = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: Math.max(0, Math.min(clientX - rect.left, imgSize.w)),
        y: Math.max(0, Math.min(clientY - rect.top, imgSize.h)),
      };
    },
    [imgSize],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent, handle: "move" | "tl" | "tr" | "bl" | "br") => {
      e.preventDefault();
      e.stopPropagation();
      const pos = getPos(e.clientX, e.clientY);
      setDragging(handle);
      setDragStart({ x: pos.x - crop.x, y: pos.y - crop.y });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [crop, getPos],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const pos = getPos(e.clientX, e.clientY);

      setCrop((prev) => {
        if (dragging === "move") {
          const nx = Math.max(0, Math.min(pos.x - dragStart.x, imgSize.w - prev.w));
          const ny = Math.max(0, Math.min(pos.y - dragStart.y, imgSize.h - prev.h));
          return { ...prev, x: nx, y: ny };
        }
        // Corner resize logic — simplified
        if (dragging === "br") {
          const nw = Math.max(50, pos.x - prev.x);
          const nh = Math.max(50, pos.y - prev.y);
          return { ...prev, w: nw, h: nh };
        }
        if (dragging === "tl") {
          const nx = Math.max(0, Math.min(pos.x, prev.x + prev.w - 50));
          const ny = Math.max(0, Math.min(pos.y, prev.y + prev.h - 50));
          return { x: nx, y: ny, w: prev.x + prev.w - nx, h: prev.y + prev.h - ny };
        }
        if (dragging === "tr") {
          const nw = Math.max(50, pos.x - prev.x);
          const ny = Math.max(0, Math.min(pos.y, prev.y + prev.h - 50));
          return { ...prev, y: ny, w: nw, h: prev.y + prev.h - ny };
        }
        if (dragging === "bl") {
          const nx = Math.max(0, Math.min(pos.x, prev.x + prev.w - 50));
          const nh = Math.max(50, pos.y - prev.y);
          return { x: nx, y: prev.y, w: prev.x + prev.w - nx, h: nh };
        }
        return prev;
      });
    },
    [dragging, getPos, dragStart, imgSize],
  );

  const doCrop = async () => {
    const img = imgRef.current;
    if (!img) return;
    const scaleX = img.naturalWidth / imgSize.w;
    const scaleY = img.naturalHeight / imgSize.h;

    const canvas = document.createElement("canvas");
    canvas.width = crop.w * scaleX;
    canvas.height = crop.h * scaleY;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      img,
      crop.x * scaleX, crop.y * scaleY, crop.w * scaleX, crop.h * scaleY,
      0, 0, canvas.width, canvas.height,
    );
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return;
    const croppedFile = new File([blob], `cropped-${imageFile.name}`, { type: "image/png" });
    onCropComplete(croppedFile);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 text-center">
        Drag to adjust crop area. Hold corners to resize.
      </p>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 mx-auto"
        style={{ width: imgSize.w, height: imgSize.h, maxWidth: "100%" }}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerCancel={() => setDragging(null)}
      >
        <img ref={imgRef} src={imageUrl} alt="Crop" className="w-full h-full object-contain" />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        {/* Crop area */}
        <div
          className="absolute border-2 border-white shadow-lg cursor-move"
          style={{
            left: crop.x, top: crop.y, width: crop.w, height: crop.h,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute inset-0 bg-transparent" onPointerDown={(e) => onPointerDown(e, "move")} />
          {/* Corner handles */}
          {(["tl", "tr", "bl", "br"] as const).map((h) => (
            <div
              key={h}
              className="absolute h-4 w-4 bg-white border-2 border-blue-500 rounded-full z-10"
              style={{
                ...(h.includes("t") ? { top: -8 } : { bottom: -8 }),
                ...(h.includes("l") ? { left: -8 } : { right: -8 }),
                cursor: `${h}-resize`,
              }}
              onPointerDown={(e) => onPointerDown(e, h)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={doCrop}
          className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Apply Crop
        </button>
      </div>
    </div>
  );
}
