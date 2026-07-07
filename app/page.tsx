"use client";

import { useState } from "react";
import HeroSection from "./components/hero-section";
import ImageProcessor from "./components/image-processor";
import FeaturesSection from "./components/features-section";
import HowToSection from "./components/how-to-section";
import FaqSection from "./components/faq-section";
import { en } from "./lib/i18n";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <main className="flex-1">
      <HeroSection t={en.hero} onImageSelected={setImageFile} />
      <ImageProcessor imageFile={imageFile} t={en.processing} />
      <FeaturesSection t={en.features} />
      <HowToSection t={en.howto} />
      <FaqSection t={en.faq} />
    </main>
  );
}
