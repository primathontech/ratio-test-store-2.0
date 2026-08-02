/**
 * Middleware Types
 *
 * Type definitions for middleware utilities.
 *
 * @module bootstrap/middleware
 */

/**
 * A/B testing cookie values
 */
export interface ABTestCookies {
  home?: string;
  collection?: string;
  product?: string;
}

/**
 * Locale detection result
 */
export interface LocaleResult {
  locale: string;
  fromCookie: boolean;
}

/**
 * Middleware configuration
 */
export interface MiddlewareConfig {
  /** Paths to skip middleware processing */
  skipPaths: string[];
  /** A/B test cookie names */
  abTestCookies: {
    home: string;
    collection: string;
    product: string;
  };
  /** Locale cookie name */
  localeCookieName: string;
  /** Default locale */
  defaultLocale: string;
  /** Valid locales */
  validLocales: readonly string[];
}

/**
 * Default middleware configuration
 */
export const defaultMiddlewareConfig: MiddlewareConfig = {
  skipPaths: ["/api", "/_next", "/static/"],
  abTestCookies: {
    home: "_prima_ptr_ab_home",
    collection: "_prima_ptr_ab_collection",
    product: "_prima_ptr_ab_product",
  },
  localeCookieName: "NEXT_LOCALE",
  defaultLocale: "en",
  validLocales: ["en"],
};
