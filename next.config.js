/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hapus output: 'export' agar Next.js pakai mode dinamis
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
