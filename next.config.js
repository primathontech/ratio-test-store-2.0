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
    ],
  },

  // App-specific static paths for caching
  cache: {
    additionalStaticPaths: [],
  },

  // App-specific redirects (wellversed.in legacy pages)
  redirects: [],
});
