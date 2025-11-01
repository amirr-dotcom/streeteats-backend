/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14+
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  output: "standalone", // ✅ Important for Vercel edge/serverless build
};

module.exports = nextConfig;
