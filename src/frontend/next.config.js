/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Standalone mode requires the native `sharp` package for image
  // optimization; the only images here are small static logos, so
  // serve them as-is instead.
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://backend:8000"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
