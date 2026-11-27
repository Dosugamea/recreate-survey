import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 任意のHTTPS URLを許可
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      // HTTPも許可（開発環境用）
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

// ローカル開発時に Cloudflare Workers のバインディングを利用可能にする
initOpenNextCloudflareForDev();
