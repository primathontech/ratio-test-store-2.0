/**
 * i18n Bootstrap - @shopkit/i18n Configuration (Server-Side)
 *
 * This file contains SERVER-ONLY i18n utilities.
 * It should ONLY be imported by server components and server-side code.
 *
 * ============================================================================
 * WARNING: SERVER-ONLY
 * ============================================================================
 *
 * This file imports from next/headers and other server-only APIs.
 * Do NOT import this file in client components.
 *
 * For client-safe configuration, import from bootstrap/i18n-config.ts instead.
 *
 * ============================================================================
 * FOR AGENCIES: This file is INTERNAL INFRASTRUCTURE
 * ============================================================================
 *
 * Agency developers should NOT modify this file. To add translations:
 *   - Create JSON files in @/themes/{merchant}/locales/common/{locale}.json
 *   - Create JSON files in @/themes/{merchant}/locales/pages/{page}/{locale}.json
 *   - Run `bun run generate:i18n` (or it runs automatically on build)
 *
 * @module bootstrap/i18n
 * @internal
 */

import {
  LOCALE_MANIFEST,
  loadMessages as loadMessagesFromManifest,
  type LocaleManifest,
} from "@/locales/.generated/manifest";
import { isValidLocale, type Locale, type PageName } from "@/locales/.generated/types";
import {
  createGetStaticLocale,
  createGetLocale,
  createSetLocaleCookie,
} from "@shopkit/i18n/server";
import { i18nConfig } from "./i18n-config";

// Re-export config for backward compatibility with server components
export { i18nConfig, isValidLocale };
export type { Locale, PageName };

// =============================================================================
// SERVER UTILITIES
// =============================================================================

/**
 * Server utilities configuration using this app's locale settings.
 */
const serverUtilsConfig = {
  defaultLocale: i18nConfig.defaultLocale,
  cookieName: i18nConfig.localeDetection.cookieName,
  isValidLocale,
};

/**
 * Get the static/default locale for this application.
 * SERVER-ONLY: Do not use in client components.
 */
export const getStaticLocale = createGetStaticLocale(serverUtilsConfig);

/**
 * Get the current locale from cookies or headers.
 * SERVER-ONLY: Do not use in client components.
 */
export const getLocale = createGetLocale(serverUtilsConfig);

/**
 * Set the locale cookie.
 * SERVER-ONLY: Do not use in client components.
 */
export const setLocaleCookie = createSetLocaleCookie(serverUtilsConfig);

// =============================================================================
// MESSAGE LOADING
// =============================================================================

/**
 * Load translation messages for a locale.
 *
 * This function merges common translations with optional page-specific translations.
 * It uses dynamic imports for code splitting.
 *
 * @param locale - The locale to load messages for
 * @param pageName - Optional page name for page-specific translations
 * @returns Promise resolving to merged translation messages
 *
 * @example
 * ```typescript
 * // Load only common messages
 * const messages = await loadMessages("en");
 *
 * // Load common + home page messages
 * const messages = await loadMessages("en", "home");
 * ```
 */
export async function loadMessages(
  locale: Locale,
  pageName?: PageName
): Promise<Record<string, any>> {
  return loadMessagesFromManifest(locale, pageName);
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get the locale manifest.
 * Useful for advanced use cases that need direct access to the manifest.
 */
export function getLocaleManifest(): LocaleManifest {
  return LOCALE_MANIFEST;
}
