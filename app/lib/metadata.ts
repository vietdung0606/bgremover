import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dzungnguyen.vercel.app";
const SITE_NAME = "AI Background Remover";

export function buildMetadata({
  title,
  description,
  path = "",
  lang = "en",
}: {
  title?: string;
  description?: string;
  path?: string;
  lang?: "en" | "vi";
}): Metadata {
  const defaultTitle =
    lang === "vi"
      ? "Xóa Nền Ảnh Miễn Phí — AI Background Remover, Không Cần Đăng Ký"
      : "Free AI Background Remover — Remove Image Background Instantly, No Signup";

  const defaultDescription =
    lang === "vi"
      ? "Xóa nền ảnh online miễn phí, không watermark, không cần đăng ký. AI xử lý ngay trên trình duyệt — ảnh không rời khỏi thiết bị. Hỗ trợ PNG trong suốt."
      : "Remove image backgrounds free, no signup, no watermark. AI-powered background remover runs in your browser — your image never leaves your device. Download transparent PNG.";

  const resolvedTitle = title ?? defaultTitle;
  const resolvedDescription = description ?? defaultDescription;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: path ? `${SITE_URL}${path}` : SITE_URL,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Background Remover",
  description:
    "Free AI-powered background removal tool. No signup, no watermark, 100% private — your image never leaves your device.",
  applicationCategory: "Multimedia",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};
