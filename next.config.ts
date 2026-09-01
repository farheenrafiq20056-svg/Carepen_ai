import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Vercel deployment
  output: "standalone",
  // Allow external images (DiceBear avatars, Unsplash)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
