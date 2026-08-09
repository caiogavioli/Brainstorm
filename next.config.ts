import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Uploads de fotos das ocorrências trafegam por Server Actions.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
