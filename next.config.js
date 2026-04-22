/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 