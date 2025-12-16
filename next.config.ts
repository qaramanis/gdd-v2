/** @type {import('next').NextConfig} */

const nextConfig: import("next").NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["image.api.playstation.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "minio",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
  // Enable standalone output for Docker
  output: "standalone",
};

module.exports = nextConfig;
