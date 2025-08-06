/** @type {import('next').NextConfig} */

const nextConfig: import("next").NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["image.api.playstation.com"],
  },
};

module.exports = nextConfig;
