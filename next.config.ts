import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/frenchApartments",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
