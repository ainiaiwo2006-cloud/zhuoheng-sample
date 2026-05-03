import createNextIntlPlugin from "next-intl/plugin";
import webpack from "webpack";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Future-ready for self-hosted image optimization with remote patterns.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  webpack: (config, { nextRuntime }) => {
    // Stub __dirname for Edge runtime — next-intl's extractor module
    // generates unreachable code that references __dirname; without this
    // stub the middleware crashes at runtime on Vercel Edge.
    if (nextRuntime === "edge") {
      config.plugins.push(
        new webpack.DefinePlugin({
          __dirname: '""',
          __filename: '""',
        })
      );
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
