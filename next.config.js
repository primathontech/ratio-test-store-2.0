const { createNextConfig } = require("./src/bootstrap/next-config");

// Extra image hostnames provided at deploy time. Comma-separated list in
// NEXT_PUBLIC_IMAGE_HOSTS (e.g. "cdn.example.com,img.example.com"). Each is
// appended to additionalRemotePatterns so a merchant can whitelist their own
// image CDN without editing this file.
const envImageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean)
  .map((hostname) => ({
    protocol: "https",
    hostname,
    port: "",
    pathname: "/**",
  }));

/** @type {import('next').NextConfig} */
module.exports = createNextConfig({
  // App-specific image domains
  images: {
    // Allow our own inline/SVG brand assets (e.g. the Ratio logo) to render
    // through next/image. Locked down with a strict CSP so untrusted SVGs
    // still can't execute scripts.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
      // Merchant-provided hosts via NEXT_PUBLIC_IMAGE_HOSTS (see top of file).
      ...envImageHosts,
    ],
  },

  // App-specific static paths for caching
  cache: {
    additionalStaticPaths: [],
  },

  // App-specific redirects
  redirects: [],

  // the GoKwik API slower than local, so per-page prerender can exceed the 60s
  // default and get dropped. Gives slow fetches more headroom to complete.
  // Raise static-generation timeout 60s -> 180s. The CI build container reaches
  extend: (config) => ({ ...config, staticPageGenerationTimeout: 180 }),
});
