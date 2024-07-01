/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
    images: {
      domains: ['via.placeholder.com'],
    },
};
export default nextConfig;