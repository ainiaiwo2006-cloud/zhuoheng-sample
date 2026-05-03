import createNextIntlPlugin from "next-intl/plugin";
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
  webpack: (config, { nextRuntime, webpack }) => {
    if (nextRuntime === "edge") {
      // Stub __dirname/__filename — next-intl's extractor module
      // generates unreachable code that references them; Edge runtime
      // doesn't define them so the module crashes when parsed.
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
