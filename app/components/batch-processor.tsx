"use client";

import { useState, useCallback } from "react";
import ImageUploader from "./image-uploader";

interface BatchItem {
  id: number;
  file: File;
  status: "queued" | "loading" | "done" | "error";
  resultUrl?: string;
}

interface Props {
  t: Record<string, string>;
}

export default function BatchProcessor({ t }: Props) {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [processing, setProcessing] = useState(false);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newItems: BatchItem[] = Array.from(files).map((file, i) => ({
        id: Date.now() + i,
        file,
        status: "queued" as const,
      }));
      setItems((prev) => [...prev, ...newItems]);
    },
    [],
  );

  const processAll = useCallback(async () => {
    setProcessing(true);
    const { removeBackground } = await import("@imgly/background-removal");

    for (const item of items.filter((i) => i.status === "queued")) {
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "loading" } : it)));
      try {
        const blob = await removeBackground(item.file);
        const url = URL.createObjectURL(blob);
        setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "done", resultUrl: url } : it)));
      } catch {
        setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "error" } : it)));
      }
    }
    setProcessing(false);
  }, [items]);

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearAll = () => setItems([]);

  const queuedCount = items.filter((i) => i.status === "queued").length;
  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <ImageUploader
        onImageSelected={(file) => addFiles([file])}
        t={{ cta: t.cta || "Add Images", dragDrop: t.dragDrop || "or drag & drop images here" }}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {items.length} image{items.length !== 1 ? "s" : ""}
          {doneCount > 0 && ` • ${doneCount} done`}
          {queuedCount > 0 && ` • ${queuedCount} queued`}
        </p>
        <div className="flex gap-2">
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-zinc-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
          {queuedCount > 0 && (
            <button
              onClick={processAll}
              disabled={processing}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {processing ? "Processing..." : `Process ${queuedCount} image${queuedCount > 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </div>

      {/* Image grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            >
              {item.status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-white border-t-blue-600" />
                </div>
              )}
              {item.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50/80 z-10">
                  <span className="text-red-500 text-sm">Failed</span>
                </div>
              )}
              <img
                src={item.resultUrl || URL.createObjectURL(item.file)}
                alt=""
                className="w-full h-32 object-contain bg-[url('/checkerboard.svg')] bg-repeat"
              />
              <div className="p-2 flex items-center justify-between">
                <span className="text-xs text-zinc-500 truncate max-w-[80%]">{item.file.name}</span>
                {item.status === "done" && item.resultUrl && (
                  <a
                    href={item.resultUrl}
                    download={`bg-removed-${item.file.name}`}
                    className="shrink-0 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 text-zinc-400 hover:text-red-500 ml-1"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
