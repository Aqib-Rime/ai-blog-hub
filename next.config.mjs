import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  cacheComponents: true,

  serverActions: {
    bodySizeLimit: '10mb',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // PostHog reverse proxy configuration
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
