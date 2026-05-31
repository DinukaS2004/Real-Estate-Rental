import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        turbopackFileSystemCacheForDev: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "*.r2.dev",
            },
            {
                protocol: "https",
                hostname: "pub-*.r2.dev",
            },
        ],
    },
};

export default nextConfig;