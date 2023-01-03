/** @type {import('next').NextConfig} */

module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `http://localhost:5000/api/:path*`,
        },
      ],
    }
  },
  reactStrictMode: true,
  experimental: {
    urlImports: [
        "https://framer.com/m/",
        "https://framerusercontent.com/",
        "https://ga.jspm.io/",
        "https://jspm.dev/",
    ],
},
  
}