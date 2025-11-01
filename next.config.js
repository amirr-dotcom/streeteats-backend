/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14+
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Note: output: "standalone" removed - Vercel handles this automatically
};

module.exports = nextConfig;
