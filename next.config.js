/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
    },
    // Enable experimental features for better performance
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig
