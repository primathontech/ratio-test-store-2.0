/**
 * Next.js Config Types
 *
 * Type definitions for the createNextConfig factory function.
 *
 * @module bootstrap/next-config.types
 */

import type { NextConfig } from "next";

/**
 * Remote image pattern configuration
 */
export interface RemotePattern {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname?: string;
}

/**
 * Cache header configuration
 */
export interface CacheHeader {
  source: string;
  headers: Array<{
    key: string;
    value: string;
  }>;
}

/**
 * Redirect configuration
 */
export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

/**
 * Image optimization configuration
 */
export interface ImageConfig {
  /** Additional remote patterns beyond the defaults */
  additionalRemotePatterns?: RemotePattern[];
  /** Override default formats */
  formats?: ("image/webp" | "image/avif")[];
  /** Override cache TTL (default: 1 year) */
  minimumCacheTTL?: number;
  /** Override device sizes */
  deviceSizes?: number[];
  /** Override image sizes */
  imageSizes?: number[];
  /** Allow SVG (default: true) */
  dangerouslyAllowSVG?: boolean;
  /** Override CSP for images */
  contentSecurityPolicy?: string;
  /** Disable optimization */
  unoptimized?: boolean;
}

/**
 * Cache configuration for different route types
 */
export interface CacheConfig {
  /** Additional static paths to cache with immutable headers */
  additionalStaticPaths?: string[];
  /** Additional static paths that need both cache AND CORS headers */
  additionalCorsStaticPaths?: string[];
  /** Custom headers for products routes */
  products?: {
    maxAge?: number;
    sMaxAge?: number;
    staleWhileRevalidate?: number;
  };
  /** Custom headers for collections routes */
  collections?: {
    maxAge?: number;
    sMaxAge?: number;
    staleWhileRevalidate?: number;
  };
  /** Custom headers for API routes */
  api?: {
    maxAge?: number;
    sMaxAge?: number;
    staleWhileRevalidate?: number;
  };
}

/**
 * Options for createNextConfig factory
 */
export interface CreateNextConfigOptions {
  /**
   * Path to i18n configuration file for next-intl plugin.
   * Set to `false` to disable next-intl integration.
   * @default "./src/bootstrap/i18n-request.ts"
   */
  i18nPath?: string | false;

  /**
   * Image optimization settings
   */
  images?: ImageConfig;

  /**
   * Cache header configuration
   */
  cache?: CacheConfig;

  /**
   * App-specific redirects
   */
  redirects?: Redirect[];

  /**
   * App-specific additional headers
   */
  additionalHeaders?: CacheHeader[];

  /**
   * Enable Docker standalone output
   * @default process.env.DOCKER_BUILD
   */
  dockerBuild?: boolean;

  /**
   * Enable React strict mode
   * @default true
   */
  reactStrictMode?: boolean;

  /**
   * Remove console logs in production
   * @default true
   */
  removeConsoleInProduction?: boolean;

  /**
   * ESLint configuration
   */
  eslint?: {
    dirs?: string[];
    ignoreDuringBuilds?: boolean;
  };

  /**
   * TypeScript configuration
   */
  typescript?: {
    ignoreBuildErrors?: boolean;
  };

  /**
   * Packages to transpile (for monorepo)
   */
  transpilePackages?: string[];

  /**
   * Extend or override the generated config.
   * Called with the base config, should return the final config.
   */
  extend?: (config: NextConfig) => NextConfig;
}
