/**
 * Next.js Config Bootstrap
 *
 * Factory function for creating Next.js configuration with sensible defaults.
 * This follows the composition root pattern used throughout bootstrap/.
 *
 * NOTE: This is a .js file because next.config.js runs before TypeScript compilation.
 * The TypeScript types are in next-config.types.ts for use in the rest of the app.
 *
 * @module bootstrap/next-config
 */

const {
  buildFrameAncestorsHeaders: buildFrameAncestorsFromPackage,
} = require("@shopkit/editor-bridge/next");
const {
  ALLOWED_EDITOR_ORIGINS,
} = require("../editor-integration/editor-bridge-config");

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

/**
 * Default Shopify CDN image patterns.
 * These are common across all Shopify storefronts.
 */
const DEFAULT_SHOPIFY_IMAGE_PATTERNS = [
  {
    protocol: "https",
    hostname: "cdn.shopify.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "**.shopifycdn.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "**.cdn.shopify.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "shopifycdn.com",
    port: "",
    pathname: "/**",
  },
];

/**
 * Common placeholder/stock image patterns.
 */
const DEFAULT_PLACEHOLDER_IMAGE_PATTERNS = [
  {
    protocol: "https",
    hostname: "picsum.photos",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "upload.wikimedia.org",
    port: "",
    pathname: "/**",
  },
];

/**
 * Common third-party service image patterns.
 */
const DEFAULT_THIRD_PARTY_IMAGE_PATTERNS = [
  // S3 bucket for dev assets
  {
    protocol: "https",
    hostname: "ecomapp-dev-v2.s3.ap-south-1.amazonaws.com",
    port: "",
    pathname: "/**",
  },
  // GoKwik checkout
  {
    protocol: "https",
    hostname: "kwikcart.gokwik.co",
    port: "",
    pathname: "/kwikcart/**",
  },
  {
    protocol: "https",
    hostname: "pdp.gokwik.co",
    port: "",
    pathname: "/assets/**",
  },
];

/**
 * Default image optimization settings.
 */
const DEFAULT_IMAGE_CONFIG = {
  formats: ["image/webp", "image/avif"],
  minimumCacheTTL: 31536000, // 1 year
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 618],
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  unoptimized: false,
};

/**
 * Default static paths that should be cached immutably.
 */
const DEFAULT_STATIC_PATHS = [
  "/_next/static/:path*",
  "/images/:path*",
  "/media/:path*",
  "/assets/:path*",
];

/**
 * Immutable cache header value (1 year).
 */
const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

/**
 * No-cache header value for service workers.
 */
const NO_CACHE = "no-cache, no-store, must-revalidate";

// =============================================================================
// HEADER BUILDERS
// =============================================================================

/**
 * Build static asset cache headers.
 */
function buildStaticHeaders(
  additionalPaths = [],
  additionalCorsStaticPaths = []
) {
  const paths = [...DEFAULT_STATIC_PATHS, ...additionalPaths];

  const staticHeaders = paths.map((source) => ({
    source,
    headers: [
      {
        key: "Cache-Control",
        value: IMMUTABLE_CACHE,
      },
    ],
  }));

  // Add CORS static paths (paths that need both cache and CORS headers)
  const corsHeaders = additionalCorsStaticPaths.map((source) => ({
    source,
    headers: [
      { key: "Cache-Control", value: IMMUTABLE_CACHE },
      { key: "Access-Control-Allow-Origin", value: "*" },
    ],
  }));

  return [...staticHeaders, ...corsHeaders];
}

/**
 * Build font and CDN headers with CORS support.
 */
function buildCorsStaticHeaders() {
  return [
    {
      source: "/fonts/:path*",
      headers: [
        { key: "Cache-Control", value: IMMUTABLE_CACHE },
        { key: "Access-Control-Allow-Origin", value: "*" },
      ],
    },
    {
      source: "/cdn/shop/files/:path*",
      headers: [
        { key: "Cache-Control", value: IMMUTABLE_CACHE },
        { key: "Access-Control-Allow-Origin", value: "*" },
      ],
    },
  ];
}

/**
 * Build dynamic content headers (products, collections).
 */
function buildDynamicContentHeaders(cache = {}) {
  const productsConfig = cache.products ?? {
    maxAge: 0,
    sMaxAge: 7200,
    staleWhileRevalidate: 86400,
  };

  const collectionsConfig = cache.collections ?? {
    maxAge: 0,
    sMaxAge: 3600,
    staleWhileRevalidate: 7200,
  };

  return [
    {
      source: "/products/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: `public, max-age=${productsConfig.maxAge}, s-maxage=${productsConfig.sMaxAge}, stale-while-revalidate=${productsConfig.staleWhileRevalidate}`,
        },
        { key: "Vary", value: "Accept-Language, Accept-Encoding" },
      ],
    },
    {
      source: "/collections/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: `public, max-age=${collectionsConfig.maxAge}, s-maxage=${collectionsConfig.sMaxAge}, stale-while-revalidate=${collectionsConfig.staleWhileRevalidate}`,
        },
        { key: "Vary", value: "Accept-Language, Accept-Encoding" },
      ],
    },
  ];
}

/**
 * Build API route headers.
 */
function buildApiHeaders(cache = {}) {
  const apiConfig = cache.api ?? {
    maxAge: 0,
    sMaxAge: 600,
    staleWhileRevalidate: 3600,
  };

  return [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: `public, max-age=${apiConfig.maxAge}, s-maxage=${apiConfig.sMaxAge}, stale-while-revalidate=${apiConfig.staleWhileRevalidate}`,
        },
      ],
    },
  ];
}

/**
 * Build CSP `frame-ancestors` header gating who can iframe this storefront.
 * Reads the allowlist from editor-bridge-config so the build-time CSP and
 * the runtime origin gate consume the same constants.
 */
function buildFrameAncestorsHeaders() {
  return buildFrameAncestorsFromPackage({
    allowedEditorOrigins: ALLOWED_EDITOR_ORIGINS,
  });
}

/**
 * Build service worker headers.
 */
function buildServiceWorkerHeaders() {
  return [
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: NO_CACHE },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
  ];
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * @typedef {import('./next-config.types').CreateNextConfigOptions} CreateNextConfigOptions
 * @typedef {import('./next-config.types').RemotePattern} RemotePattern
 * @typedef {import('./next-config.types').CacheHeader} CacheHeader
 * @typedef {import('./next-config.types').Redirect} Redirect
 * @typedef {import('next').NextConfig} NextConfig
 */

/**
 * Create a Next.js configuration with sensible defaults for storefronts.
 *
 * @param {CreateNextConfigOptions} options - Configuration options
 * @returns {NextConfig} Next.js configuration object
 *
 * @example
 * // next.config.js - Basic usage
 * const { createNextConfig } = require("./src/bootstrap/next-config");
 *
 * module.exports = createNextConfig({
 *   i18nPath: "./src/i18n.ts",
 * });
 *
 * @example
 * // next.config.js - With custom options
 * const { createNextConfig } = require("./src/bootstrap/next-config");
 *
 * module.exports = createNextConfig({
 *   i18nPath: "./src/i18n.ts",
 *   images: {
 *     additionalRemotePatterns: [
 *       { protocol: "https", hostname: "mycdn.com", pathname: "/**" },
 *     ],
 *   },
 *   redirects: [
 *     { source: "/old", destination: "/new", permanent: true },
 *   ],
 * });
 */
function createNextConfig(options = {}) {
  const {
    i18nPath = "./src/bootstrap/i18n-request.ts",
    images = {},
    cache = {},
    redirects = [],
    additionalHeaders = [],
    dockerBuild = !!process.env.DOCKER_BUILD,
    reactStrictMode = true,
    removeConsoleInProduction = true,
    eslint = { dirs: ["src"], ignoreDuringBuilds: false },
    typescript = { ignoreBuildErrors: true },
    transpilePackages,
    extend,
  } = options;

  // Build remote patterns
  const remotePatterns = [
    ...DEFAULT_SHOPIFY_IMAGE_PATTERNS,
    ...DEFAULT_PLACEHOLDER_IMAGE_PATTERNS,
    ...DEFAULT_THIRD_PARTY_IMAGE_PATTERNS,
    ...(images.additionalRemotePatterns ?? []),
  ];

  // Build headers
  const headers = [
    ...buildStaticHeaders(
      cache.additionalStaticPaths,
      cache.additionalCorsStaticPaths
    ),
    ...buildCorsStaticHeaders(),
    ...buildDynamicContentHeaders(cache),
    ...buildApiHeaders(cache),
    ...buildFrameAncestorsHeaders(),
    ...buildServiceWorkerHeaders(),
    ...additionalHeaders,
  ];

  // Build base config
  let config = {
    ...(dockerBuild && { output: "standalone" }),
    reactStrictMode,

    eslint,
    typescript,

    compiler: {
      ...(removeConsoleInProduction &&
        process.env.NODE_ENV === "production" && { removeConsole: true }),
    },

    images: {
      remotePatterns,
      formats: images.formats ?? [...DEFAULT_IMAGE_CONFIG.formats],
      minimumCacheTTL:
        images.minimumCacheTTL ?? DEFAULT_IMAGE_CONFIG.minimumCacheTTL,
      deviceSizes: images.deviceSizes ?? DEFAULT_IMAGE_CONFIG.deviceSizes,
      imageSizes: images.imageSizes ?? DEFAULT_IMAGE_CONFIG.imageSizes,
      dangerouslyAllowSVG:
        images.dangerouslyAllowSVG ?? DEFAULT_IMAGE_CONFIG.dangerouslyAllowSVG,
      contentSecurityPolicy:
        images.contentSecurityPolicy ??
        DEFAULT_IMAGE_CONFIG.contentSecurityPolicy,
      unoptimized: images.unoptimized ?? DEFAULT_IMAGE_CONFIG.unoptimized,
    },

    async headers() {
      return headers;
    },

    ...(redirects.length > 0 && {
      async redirects() {
        return redirects;
      },
    }),

    ...(transpilePackages && { transpilePackages }),
  };

  // Apply extensions
  if (extend) {
    config = extend(config);
  }

  // Wrap with next-intl if i18nPath provided
  if (i18nPath) {
    const createNextIntlPlugin = require("next-intl/plugin");
    const withNextIntl = createNextIntlPlugin(i18nPath);
    return withNextIntl(config);
  }

  return config;
}

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  createNextConfig,
  DEFAULT_SHOPIFY_IMAGE_PATTERNS,
  DEFAULT_PLACEHOLDER_IMAGE_PATTERNS,
  DEFAULT_THIRD_PARTY_IMAGE_PATTERNS,
  DEFAULT_IMAGE_CONFIG,
  DEFAULT_STATIC_PATHS,
};
