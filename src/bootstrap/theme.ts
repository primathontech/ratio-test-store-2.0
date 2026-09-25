/**
 * Theme Bootstrap - @shopkit/core Theme Configuration
 *
 * This module configures and initializes the theme system for the application.
 * It provides utilities for loading themes from the file system.
 *
 * ## Usage
 *
 * ```typescript
 * import { getTheme, configureAppTheme } from "@/bootstrap/theme";
 *
 * // In layout.tsx (server component)
 * const theme = await getTheme(themeName);
 * ```
 *
 * @module bootstrap/theme
 */

import {
  getActiveTheme,
  configureThemeLoader,
} from "@shopkit/core/theme/server";
import type { Theme } from "@shopkit/core/theme";

// =============================================================================
// THEME LOADER CONFIGURATION
// =============================================================================

let isConfigured = false;

/**
 * Configure the theme loader for file-system based themes.
 *
 * This must be called before any getTheme() calls. It's safe to call
 * multiple times - subsequent calls are no-ops.
 */
export function configureAppTheme(): void {
  if (isConfigured) {
    return;
  }

  configureThemeLoader({
    async loadTheme(themeName: string) {
      const module = await import(`@/themes/${themeName}/theme.json`);
      return {
        id: module.default.id,
        name: module.default.name,
        role: module.default.role,
        config: module.default.config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
  });

  isConfigured = true;
}

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Get the active theme by name.
 *
 * This function:
 * 1. Ensures the theme loader is configured
 * 2. Loads the theme from the file system
 * 3. Returns the theme configuration
 *
 * @param themeName - The theme name (e.g., "dawn")
 * @returns The theme configuration
 *
 * @example
 * ```typescript
 * const theme = await getTheme("dawn");
 * // theme.config contains colors, typography, etc.
 * ```
 */
export async function getTheme(themeName: string): Promise<Theme | null> {
  // Ensure theme loader is configured
  configureAppTheme();

  // Load and return the theme
  return getActiveTheme(themeName);
}

// Re-export types for convenience
export type { Theme };
