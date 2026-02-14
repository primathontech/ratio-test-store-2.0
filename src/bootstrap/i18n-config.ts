/**
 * i18n Configuration - Client-Safe
 *
 * This file contains ONLY client-safe i18n configuration.
 * It can be safely imported by client components.
 *
 * ============================================================================
 * IMPORTANT: NO SERVER IMPORTS
 * ============================================================================
 *
 * This file must NOT import anything that uses:
 *   - next/headers
 *   - Server-only APIs
 *   - Any module that transitively imports server code
 *
 * For server utilities (getLocale, getStaticLocale), import from bootstrap/i18n.ts
 *
 * @module bootstrap/i18n-config
 */

import {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_NAMES,
  isValidLocale,
  type Locale,
  type PageName,
} from "@/locales/.generated/types";

// =============================================================================
// CONFIGURATION (Client-Safe)
// =============================================================================

/**
 * i18n configuration for this application.
 * Values are derived from the auto-generated manifest.
 *
 * This configuration is safe to use in client components.
 */
export const i18nConfig = {
  /**
   * All supported locales (auto-detected from translation files)
   */
  locales: LOCALES,

  /**
   * Default locale when none is specified or detected
   */
  defaultLocale: DEFAULT_LOCALE,

  /**
   * Display names for each locale
   */
  localeNames: LOCALE_NAMES,

  /**
   * Locale detection settings
   */
  localeDetection: {
    /**
     * Order of locale detection methods
     */
    order: ["cookie", "header", "default"] as const,

    /**
     * Cookie name for storing locale preference
     */
    cookieName: "locale",

    /**
     * Header name for locale detection
     */
    headerName: "accept-language",
  },
} as const;

// =============================================================================
// UTILITIES (Client-Safe)
// =============================================================================

/**
 * Check if a value is a valid locale.
 *
 * @param value - The value to check
 * @returns True if the value is a valid locale
 */
export { isValidLocale };

// =============================================================================
// RE-EXPORTS (Client-Safe)
// =============================================================================

// Re-export types for convenience
export type { Locale, PageName };
export { LOCALES, DEFAULT_LOCALE, LOCALE_NAMES };
