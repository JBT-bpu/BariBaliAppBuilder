import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow network access from local IP addresses
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
