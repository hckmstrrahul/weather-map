/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['source.unsplash.com', 'images.unsplash.com', 'openweathermap.org', 'maps.googleapis.com', 'maps.gstatic.com'],
  },
}

module.exports = nextConfig 