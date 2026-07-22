import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["thygas.diegogaspar.dev.br", "thygascoins.com.br"],
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
