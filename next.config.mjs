import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output is required for the Dockerfile to copy a self-contained build.
  output: "standalone",
  // Future-ready for self-hosted image optimization with remote patterns.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Unsplash for free CC0 demo photos
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // Local demo placeholder service (handy if user drops photos in /public/demo-images)
      // (no remotePattern needed for /public files)
      // Future: your own CDN
      // { protocol: "https", hostname: "cdn.zhuoheng.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
