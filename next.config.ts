import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["thygas.diegogaspar.dev.br"],
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
