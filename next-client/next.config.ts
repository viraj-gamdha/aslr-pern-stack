import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/styles/media" as *;`,
  },
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
