import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.apple.com" },
      { protocol: "https", hostname: "imgs.search.brave.com" },
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
