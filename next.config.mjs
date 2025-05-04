/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "small-lapwing-585.convex.cloud" }],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // API route you want to proxy
        destination: `${process.env.NEXT_PUBLIC_TRANSCRIPTION_URL}/:path*`, // Target backend server
      }
    ];
  },
};

export default nextConfig;
