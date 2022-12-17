/** @type {import('next').NextConfig} */

module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `http://localhost:8000/api/:path*`,
        },
      ],
    }
  },
  reactStrictMode: true
  
}