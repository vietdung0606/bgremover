import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { jsonLd } from "./lib/metadata";
import Footer from "./components/footer";
import SerwistProvider from "./components/serwist-provider";
import { en } from "./lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free AI Background Remover — Remove Image Background Instantly, No Signup",
  description:
    "Remove image backgrounds free, no signup, no watermark. AI-powered background remover runs in your browser — your image never leaves your device. Download transparent PNG.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rmbg.online"),
  openGraph: {
    title: "Free AI Background Remover — Remove Image Background Instantly",
    description:
      "Remove image backgrounds free, no signup, no watermark. AI runs in your browser. 100% private.",
    siteName: "AI Background Remover",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Remove BG Online — Free AI Background Remover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Background Remover — No Signup, No Watermark",
    description:
      "Remove image backgrounds free, no signup, no watermark. AI runs in your browser. 100% private.",
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: "a3UJIoDSQYwoomnz4fSD8n5BcnoXo4_FLl2GQbKFrXI",
  },
  icons: { icon: "/favicon.ico" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Background Remover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <SerwistProvider />
        {children}
        <Footer tagline={en.footer.tagline} />
        <Analytics />
      </body>
    </html>
  );
}
