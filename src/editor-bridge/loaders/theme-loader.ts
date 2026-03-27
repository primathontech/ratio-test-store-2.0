/* eslint-disable no-console */
import type { IThemeLoader, Theme, ThemeRole } from "@shopkit/builder";

/**
 * File-system based theme loader for the editor and lib theme registry.
 *
 * Expected structure: @/themes/{merchantName}/theme.json
 */
export class FileSystemThemeLoader implements IThemeLoader {
  async loadTheme(merchantName: string): Promise<Theme> {
    const themePath = `@/themes/${merchantName}/theme.json`;

    try {
      const module = await import(`@/themes/${merchantName}/theme.json`);
      const data = module.default;

      if (!data || typeof data !== "object") {
        throw new Error(`Theme file is empty or invalid`);
      }

      if (!data.id || !data.name) {
        throw new Error(`Theme missing required fields: id, name`);
      }

      return {
        id: data.id,
        name: data.name,
        role: (data.role || "live") as ThemeRole,
        config: data.config || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`[FileSystemThemeLoader] Failed to load theme`, {
        merchantName,
        attemptedPath: themePath,
        error: errorMessage,
      });
      throw new Error(
        `Theme not found for merchant "${merchantName}". ` +
          `Ensure ${themePath} exists and exports valid theme data. ` +
          `Original error: ${errorMessage}`
      );
    }
  }
}
