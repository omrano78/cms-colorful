module.exports = {
  images: {
    loader: 'custom',
  },

  async rewrites() {
        return [
          {
            source: '/:path*',
            destination: '/',
          },
        ]
     
      },
}
