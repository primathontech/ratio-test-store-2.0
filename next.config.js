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
      {
        protocol: "https",
        hostname: "gkwk-dev-os-resources.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "os-resources.gokwik.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.s3.ap-south-1.amazonaws.com",
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

  // the GoKwik API slower than local, so per-page prerender can exceed the 60s
  // default and get dropped. Gives slow fetches more headroom to complete.
  // Raise static-generation timeout 60s -> 180s. The CI build container reaches
  extend: (config) => ({ ...config, staticPageGenerationTimeout: 180 }),
});
