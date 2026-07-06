"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Props {
  resultUrl: string;
  originalWidth: number;
  originalHeight: number;
  onResultUpdate: (url: string) => void;
  onDownload: (url: string, filename: string) => void;
}

// Simple AI-style gradient/pattern generation (no API needed — works offline)
// For real AI: integrate with GLabs or Replicate API
const PRESET_PROMPTS = [
  { label: "🌳 Forest", value: "forest nature background" },
  { label: "🏖️ Beach", value: "tropical beach background" },
  { label: "🏙️ City", value: "city skyline background" },
  { label: "🌟 Studio", value: "professional studio background" },
  { label: "🪵 Wood", value: "wooden table surface" },
  { label: "🌆 Sunset", value: "sunset gradient sky" },
  { label: "🎨 Bokeh", value: "bokeh lights blur" },
  { label: "🪴 Plants", value: "indoor plants background" },
];

export default function AiBackgroundGenerator({
  resultUrl,
  onResultUpdate,
  onDownload,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const fgImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = resultUrl;
    img.onload = () => {
      fgImgRef.current = img;
    };
  }, [resultUrl]);

  // Generate a procedural background based on prompt theme
  const generateBackground = useCallback(
    (prompt: string) => {
      setGenerating(true);
      setSelectedPreset(prompt);

      // Use requestAnimationFrame so the loading state renders first
      requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        const fg = fgImgRef.current;
        if (!canvas || !fg) {
          setGenerating(false);
          return;
        }

        canvas.width = fg.naturalWidth;
        canvas.height = fg.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setGenerating(false);
          return;
        }

        const w = canvas.width;
        const h = canvas.height;

        // Procedural generation based on prompt keywords
        if (prompt.includes("forest") || prompt.includes("nature")) {
          const grd = ctx.createLinearGradient(0, 0, 0, h);
          grd.addColorStop(0, "#2d5016");
          grd.addColorStop(0.5, "#4a7c23");
          grd.addColorStop(1, "#1a3009");
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
          // Light rays
          for (let i = 0; i < 10; i++) {
            const x = Math.random() * w;
            ctx.fillStyle = "rgba(255,255,200,0.03)";
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x - 100, h);
            ctx.lineTo(x + 100, h);
            ctx.fill();
          }
        } else if (prompt.includes("beach") || prompt.includes("tropical")) {
          const grd = ctx.createLinearGradient(0, 0, 0, h);
          grd.addColorStop(0, "#87CEEB");
          grd.addColorStop(0.6, "#E0C382");
          grd.addColorStop(0.7, "#F5DEB3");
          grd.addColorStop(1, "#C2B280");
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
          // Water shimmer
          for (let i = 0; i < 20; i++) {
            const y = h * 0.35 + Math.random() * h * 0.3;
            const x = Math.random() * w;
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.fillRect(x, y, 50, 2);
          }
        } else if (prompt.includes("city") || prompt.includes("skyline")) {
          const grd = ctx.createLinearGradient(0, 0, 0, h);
          grd.addColorStop(0, "#1a1a2e");
          grd.addColorStop(0.5, "#16213e");
          grd.addColorStop(1, "#0f3460");
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
          // Building silhouettes
          for (let i = 0; i < 15; i++) {
            const bw = 30 + Math.random() * 80;
            const bh = h * 0.2 + Math.random() * h * 0.5;
            const bx = i * (w / 15);
            ctx.fillStyle = `rgba(10,10,20,${0.5 + Math.random() * 0.5})`;
            ctx.fillRect(bx, h - bh, bw, bh);
          }
        } else if (prompt.includes("studio") || prompt.includes("professional")) {
          const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
          grd.addColorStop(0, "#ffffff");
          grd.addColorStop(0.5, "#f0f0f0");
          grd.addColorStop(1, "#d0d0d0");
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
        } else if (prompt.includes("wood") || prompt.includes("wooden")) {
          ctx.fillStyle = "#8B6914";
          ctx.fillRect(0, 0, w, h);
          // Wood grain lines
          for (let i = 0; i < 40; i++) {
            const y = (i / 40) * h;
            ctx.strokeStyle = `rgba(60,30,10,${0.05 + Math.random() * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < w; x += 20) {
              ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 8);
            }
            ctx.stroke();
          }
        } else if (prompt.includes("sunset") || prompt.includes("gradient")) {
          const grd = ctx.createLinearGradient(0, 0, 0, h);
          grd.addColorStop(0, "#ff512f");
          grd.addColorStop(0.5, "#dd2476");
          grd.addColorStop(1, "#240b36");
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
          // Sun
          const grd2 = ctx.createRadialGradient(w / 2, h * 0.65, 0, w / 2, h * 0.65, 100);
          grd2.addColorStop(0, "rgba(255,200,50,0.6)");
          grd2.addColorStop(1, "rgba(255,200,50,0)");
          ctx.fillStyle = grd2;
          ctx.fillRect(0, 0, w, h);
        } else if (prompt.includes("bokeh") || prompt.includes("lights")) {
          const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
          grd.addColorStop(0, "#1a1a2e");
          grd.addColorStop(1, "#0a0a15");
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
          // Bokeh circles
          for (let i = 0; i < 50; i++) {
            const r = 5 + Math.random() * 40;
            const x = Math.random() * w;
            const y = Math.random() * h;
            const alpha = 0.05 + Math.random() * 0.2;
            const hue = Math.random() > 0.5 ? "255,200,100" : "150,100,255";
            ctx.fillStyle = `rgba(${hue},${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (prompt.includes("plants") || prompt.includes("indoor")) {
          ctx.fillStyle = "#f5f0e8";
          ctx.fillRect(0, 0, w, h);
          // Plant silhouettes
          for (let i = 0; i < 8; i++) {
            const x = i * (w / 8) + Math.random() * 30;
            ctx.fillStyle = `rgba(${50 + Math.random() * 50},${100 + Math.random() * 80},${30 + Math.random() * 60},0.8)`;
            for (let j = 0; j < 5; j++) {
              const leafW = 15 + Math.random() * 30;
              const leafH = 40 + Math.random() * 80;
              ctx.beginPath();
              ctx.ellipse(x + (Math.random() - 0.5) * 40, h * 0.5 - j * 30, leafW, leafH, Math.random() * 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else {
          // Custom prompt: generic aesthetic gradient
          const colors = [
            ["#4facfe", "#00f2fe"],
            ["#f093fb", "#f5576c"],
            ["#a18cd1", "#fbc2eb"],
            ["#fad0c4", "#ffd1ff"],
          ];
          const pair = colors[Math.floor(Math.random() * colors.length)];
          const grd = ctx.createLinearGradient(0, 0, w, h);
          grd.addColorStop(0, pair[0]);
          grd.addColorStop(1, pair[1]);
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
        }

        // Draw foreground on top
        ctx.drawImage(fg, 0, 0);

        // Update result
        const dataUrl = canvas.toDataURL("image/png");
        onResultUpdate(dataUrl);

        setGenerating(false);
      });
    },
    [onResultUpdate],
  );

  const handleDownload = () => {
    const dataUrl = canvasRef.current?.toDataURL("image/png");
    if (dataUrl) onDownload(dataUrl, "ai-background.png");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 text-center">
        Choose a preset background or type your own prompt
      </p>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PRESET_PROMPTS.map((p) => (
          <button
            key={p.value}
            onClick={() => generateBackground(p.value)}
            className={`px-3 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedPreset === p.value && generating
                ? "border-blue-500 bg-blue-50 text-blue-700 animate-pulse"
                : selectedPreset === p.value
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom prompt */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder='Or type a prompt: "marble countertop background"'
          className="flex-1 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => customPrompt.trim() && generateBackground(customPrompt.trim())}
          disabled={!customPrompt.trim() || generating}
          className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {generating ? "..." : "Generate"}
        </button>
      </div>

      {/* Result preview */}
      <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
        <canvas ref={canvasRef} className="w-full h-auto max-h-96 object-contain" />
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
