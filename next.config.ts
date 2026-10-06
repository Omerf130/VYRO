import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src")],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
