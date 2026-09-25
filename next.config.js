const { createNextConfig } = require("./src/bootstrap/next-config");

/** @type {import('next').NextConfig} */
module.exports = createNextConfig({
  // App-specific image domains
  images: {
    additionalRemotePatterns: [
      {
        protocol: "https",
        hostname: "bblunt.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.bblunt.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev-gk-pages.dev.gokwik.in",
        port: "",
        pathname: "/**",
      },
      // nintarababy CDN for ProductMain widget
      {
        protocol: "https",
        hostname: "nintarababy.in",
        port: "",
        pathname: "/**",
      },
      // GoKwik dev S3 bucket for product images
      {
        protocol: "https",
        hostname: "gkwk-dev-os-resources.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // App-specific static paths for caching
  cache: {
    additionalStaticPaths: [],
  },

  // App-specific redirects (wellversed.in legacy pages)
  redirects: [],
});
