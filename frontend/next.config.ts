import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
};

module.exports = {
  images: {
    remotePatterns: [new URL(process.env.API_BACKEND_URL + "/api/image/*")],
  },
}

export default nextConfig;
