/**
 * Application i18n Request Configuration
 *
 * ============================================================================
 * Do NOT modify this file.
 * ============================================================================
 *
 * To add translations, simply create JSON files in:
 *   - themes/{merchant}/locales/common/{locale}.json (shared translations)
 *   - themes/{merchant}/locales/pages/{page}/{locale}.json (page-specific)
 *
 * The system automatically detects new locales and pages from the file system.
 * Run `bun run generate:i18n` to regenerate the manifest after adding files.
 *
 * @module bootstrap/i18n-request
 */

import { createAsyncI18nRequestConfig } from "@shopkit/i18n/server";

import { loadMessages, i18nConfig, type Locale } from "./i18n";

/**
 * next-intl request configuration.
 *
 * Uses async message loading for optimal code splitting.
 * Messages are loaded dynamically based on the detected locale.
 */
export default createAsyncI18nRequestConfig({
  loadMessages: (locale) => loadMessages(locale as Locale),
  defaultLocale: i18nConfig.defaultLocale,
});
