import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/styles/media" as *;`,
  },
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  output: "standalone"
};

export default nextConfig;
