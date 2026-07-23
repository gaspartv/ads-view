import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "thygas.diegogaspar.dev.br",
    "thygascoins.com.br",
    "*.tibia-info.com",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
