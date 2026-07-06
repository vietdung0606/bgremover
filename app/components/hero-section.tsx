"use client";

import { useRef } from "react";
import ImageUploader from "./image-uploader";

interface Props {
  t: {
    title: string;
    subtitle: string;
    cta: string;
    dragDrop: string;
  };
  onImageSelected: (file: File) => void;
}

export default function HeroSection({ t, onImageSelected }: Props) {
  const uploaderRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pt-20 pb-12 text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-[1.1]">
        {t.title}
      </h1>
      <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        {t.subtitle}
      </p>
      <div ref={uploaderRef}>
        <ImageUploader
          onImageSelected={onImageSelected}
          t={{ cta: t.cta, dragDrop: t.dragDrop }}
        />
      </div>
    </section>
  );
}
