import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/portfolio',
        destination: '/artworks',
        permanent: true,
      },
      {
        source: '/portfolio/:slug',
        destination: '/artworks/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
