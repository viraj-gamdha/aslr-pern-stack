import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/styles/media" as *;`,
  },
  images: {
    unoptimized: true,
  },
  output: "export", // update accordingly
};

export default nextConfig;
