export const en = {
  hero: {
    title: "Remove Image Background Instantly",
    subtitle: "Free, no signup, no watermark. 100% private — your image never leaves your device. Powered by AI, right in your browser.",
    cta: "Upload Image",
    dragDrop: "or drag & drop your image here",
  },
  features: {
    instant: {
      title: "Instant Processing",
      desc: "AI runs in your browser — no upload wait, no server queue. Results in 2-5 seconds.",
    },
    privacy: {
      title: "100% Private",
      desc: "Your image never leaves your device. Everything happens locally in your browser.",
    },
    free: {
      title: "Free Forever",
      desc: "No credit card, no signup, no hidden fees. Remove backgrounds as many times as you want.",
    },
    quality: {
      title: "HD Quality",
      desc: "High-resolution output with sharp edges. Download as transparent PNG, ready to use.",
    },
  },
  howto: {
    title: "How to Remove Background",
    step1: "Upload or drag & drop your image",
    step2: "AI removes background automatically",
    step3: "Download your transparent PNG",
  },
  faq: {
    title: "Frequently Asked Questions",
    q1: "Is this background remover really free?",
    a1: "Yes, 100% free. No signup, no credit card, no watermark, no hidden fees. You can remove backgrounds from as many images as you want.",
    q2: "How does the AI background removal work?",
    a2: "Our tool uses state-of-the-art AI running directly in your browser via WebGPU. The image never leaves your device — everything is processed locally for maximum privacy and speed.",
    q3: "What image formats are supported?",
    a3: "We support JPEG, PNG, WebP, and most common image formats. Output is always a high-quality transparent PNG.",
    q4: "Does it work on mobile?",
    a4: "Yes, the tool is fully responsive and works on iOS and Android devices. You can remove backgrounds right from your phone's browser.",
    q5: "Is my image data safe?",
    a5: "Absolutely. Your images are processed entirely in your browser using local AI. Nothing is ever uploaded to any server. Maximum privacy, guaranteed.",
  },
  processing: {
    loading: "Removing background...",
    success: "Done! Download your image below",
    error: "Something went wrong. Please try again.",
  },
  footer: {
    tagline: "Free AI-powered background removal. No signup, no watermark, 100% private.",
  },
};

export const vi: typeof en = {
  hero: {
    title: "Xóa Nền Ảnh Online Miễn Phí",
    subtitle: "Miễn phí, không cần đăng ký, không watermark. Ảnh của bạn không bao giờ rời khỏi thiết bị. Xử lý bằng AI ngay trên trình duyệt.",
    cta: "Tải Ảnh Lên",
    dragDrop: "hoặc kéo & thả ảnh vào đây",
  },
  features: {
    instant: {
      title: "Xử Lý Tức Thì",
      desc: "AI chạy ngay trên trình duyệt — không chờ upload, không hàng đợi. Kết quả trong 2-5 giây.",
    },
    privacy: {
      title: "Bảo Mật Tuyệt Đối",
      desc: "Ảnh của bạn không bao giờ rời khỏi thiết bị. Mọi thứ được xử lý cục bộ trên trình duyệt.",
    },
    free: {
      title: "Miễn Phí Vĩnh Viễn",
      desc: "Không cần thẻ tín dụng, không đăng ký, không phí ẩn. Xóa nền ảnh bao nhiêu lần tùy thích.",
    },
    quality: {
      title: "Chất Lượng HD",
      desc: "Ảnh đầu ra độ phân giải cao, viền sắc nét. Tải về dạng PNG trong suốt, sẵn sàng sử dụng.",
    },
  },
  howto: {
    title: "Cách Xóa Nền Ảnh",
    step1: "Tải lên hoặc kéo & thả ảnh của bạn",
    step2: "AI tự động xóa nền",
    step3: "Tải về ảnh PNG trong suốt",
  },
  faq: {
    title: "Câu Hỏi Thường Gặp",
    q1: "Công cụ xóa nền này có thực sự miễn phí không?",
    a1: "Có, miễn phí 100%. Không cần đăng ký, không cần thẻ tín dụng, không watermark, không phí ẩn. Bạn có thể xóa nền bao nhiêu ảnh tùy thích.",
    q2: "Công nghệ AI xóa nền hoạt động như thế nào?",
    a2: "Công cụ của chúng tôi sử dụng AI tiên tiến chạy trực tiếp trên trình duyệt thông qua WebGPU. Ảnh không bao giờ rời khỏi thiết bị của bạn — mọi thứ được xử lý cục bộ để đảm bảo quyền riêng tư và tốc độ tối đa.",
    q3: "Hỗ trợ những định dạng ảnh nào?",
    a3: "Chúng tôi hỗ trợ JPEG, PNG, WebP và hầu hết các định dạng ảnh phổ biến. Đầu ra luôn là PNG trong suốt chất lượng cao.",
    q4: "Có hoạt động trên điện thoại không?",
    a4: "Có, công cụ hoạt động tốt trên iOS và Android. Bạn có thể xóa nền ảnh ngay từ trình duyệt điện thoại.",
    q5: "Dữ liệu ảnh của tôi có an toàn không?",
    a5: "Tuyệt đối an toàn. Ảnh của bạn được xử lý hoàn toàn trên trình duyệt bằng AI cục bộ. Không có gì được tải lên máy chủ. Bảo mật tối đa, đảm bảo.",
  },
  processing: {
    loading: "Đang xóa nền...",
    success: "Xong! Tải ảnh của bạn bên dưới",
    error: "Có lỗi xảy ra. Vui lòng thử lại.",
  },
  footer: {
    tagline: "Xóa nền ảnh miễn phí bằng AI. Không đăng ký, không watermark, bảo mật 100%.",
  },
};

export type Lang = "en" | "vi";
export type Translations = typeof en;

export function getTranslations(lang: Lang): Translations {
  return lang === "vi" ? vi : en;
}
