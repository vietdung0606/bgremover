"use client";

import { useState } from "react";
import HeroSection from "./components/hero-section";
import ImageProcessor from "./components/image-processor";
import BatchProcessor from "./components/batch-processor";
import FeaturesSection from "./components/features-section";
import HowToSection from "./components/how-to-section";
import FaqSection from "./components/faq-section";
import { en } from "./lib/i18n";

type Mode = "single" | "batch";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>("single");

  return (
    <main className="flex-1">
      {/* Mode toggle */}
      <div className="flex justify-center gap-1 pt-6 bg-zinc-100 dark:bg-zinc-800/50 rounded-full p-1 w-fit mx-auto mt-6">
        {([
          { key: "single" as Mode, label: "Single Image" },
          { key: "batch" as Mode, label: "Batch Process" },
        ]).map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setMode(m.key);
              setImageFile(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === m.key
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "single" ? (
        <>
          <HeroSection t={en.hero} onImageSelected={setImageFile} />
          <ImageProcessor imageFile={imageFile} t={en.processing} />
        </>
      ) : (
        <div className="w-full max-w-4xl mx-auto px-4 pt-8 pb-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-zinc-800 dark:text-zinc-100">
            Batch Background Removal
          </h2>
          <BatchProcessor t={{ cta: en.hero.cta, dragDrop: en.hero.dragDrop }} />
        </div>
      )}

      <FeaturesSection t={en.features} />
      <HowToSection t={en.howto} />
      <FaqSection t={en.faq} />
    </main>
  );
}
