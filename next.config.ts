import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: ['three'],
    async redirects() {
        return [
            {
                source: '/projects/conduit-routing-automation',
                destination: '/projects/euler',
                permanent: true,
            },
            {
                source: '/projects/uclid',
                destination: '/projects/euler',
                permanent: true,
            },
            {
                source: '/projects/agent-red-team-suite',
                destination: '/projects/pool-bot',
                permanent: true,
            },
            {
                source: '/projects/property-intelligence-system',
                destination: '/projects/pool-bot',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/embed/primer/:path*',
                destination: '/embed/primer/index.html',
            },
        ];
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'assets.aceternity.com' }
        ],
        formats: ['image/avif', 'image/webp'],
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default withNextIntl(nextConfig);
