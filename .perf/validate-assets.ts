/**
 * Asset Validation Script
 *
 * Phase 2: Validates image, video, and font assets
 *
 * Checks:
 * - Images: ≤500KB per file
 * - Videos: ≤5MB per file
 * - Fonts: ≤100KB per file, warns if >3 font files
 *
 * Usage:
 *   bun .perf/validate-assets.ts                   # Validate all assets
 *   bun .perf/validate-assets.ts --staged-only     # Validate staged assets only
 *   bun .perf/validate-assets.ts --files="f1 f2"   # Validate specific files (CI)
 */

import { readdirSync, statSync, existsSync } from "fs";
import { join, extname, relative } from "path";
import { execSync } from "child_process";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const CONFIG = {
  image: {
    maxSize: 500 * 1024, // 500KB
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"],
    dirs: ["public"],
  },
  video: {
    maxSize: 5 * 1024 * 1024, // 5MB
    extensions: [".mp4", ".webm", ".mov", ".avi"],
    dirs: ["public"],
  },
  font: {
    maxSize: 100 * 1024, // 100KB
    extensions: [".woff", ".woff2", ".ttf", ".otf", ".eot"],
    dirs: ["public"],
    maxFiles: 3, // Warn if more than 3 font files
  },
};

const STAGED_ONLY = process.argv.includes("--staged-only");
const FILES_ARG =
  process.argv.find((a) => a.startsWith("--files="))?.split("=")[1] || "";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface AssetIssue {
  file: string;
  size: number;
  maxSize: number;
  type: "image" | "video" | "font";
}

interface ValidationResult {
  images: { total: number; issues: AssetIssue[] };
  videos: { total: number; issues: AssetIssue[] };
  fonts: { total: number; issues: AssetIssue[]; warnTooMany: boolean };
  passed: boolean;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

function getStagedFiles(): Set<string> | null {
  // If --files is provided (CI mode), use those files
  if (FILES_ARG) {
    return new Set(FILES_ARG.split(/\s+/).filter(Boolean));
  }

  // If --staged-only, use git staged files
  if (STAGED_ONLY) {
    try {
      const output = execSync(
        "git diff --cached --name-only --diff-filter=ACM",
        {
          encoding: "utf-8",
        }
      );
      return new Set(output.trim().split("\n").filter(Boolean));
    } catch {
      return new Set();
    }
  }

  // Validate all files
  return null;
}

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    if (!existsSync(currentDir)) return;

    try {
      const entries = readdirSync(currentDir);
      for (const entry of entries) {
        const fullPath = join(currentDir, entry);
        try {
          const stat = statSync(fullPath);
          if (stat.isDirectory()) {
            // Skip node_modules and .next
            if (entry !== "node_modules" && entry !== ".next") {
              walk(fullPath);
            }
          } else if (extensions.includes(extname(entry).toLowerCase())) {
            files.push(fullPath);
          }
        } catch {
          // Skip files we can't stat
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  walk(dir);
  return files;
}

function validateAssets(
  type: "image" | "video" | "font",
  extensions: string[],
  dirs: string[],
  maxSize: number,
  stagedFiles: Set<string> | null
): { total: number; issues: AssetIssue[] } {
  const issues: AssetIssue[] = [];
  let total = 0;

  for (const dir of dirs) {
    const dirPath = join(process.cwd(), dir);
    const files = getAllFiles(dirPath, extensions);

    for (const file of files) {
      const relPath = relative(process.cwd(), file);

      // Skip if staged-only mode and file not staged
      if (stagedFiles && !stagedFiles.has(relPath)) {
        continue;
      }

      total++;
      const stat = statSync(file);

      if (stat.size > maxSize) {
        issues.push({
          file: relPath,
          size: stat.size,
          maxSize,
          type,
        });
      }
    }
  }

  return { total, issues };
}

// ─────────────────────────────────────────────
// Main Validation
// ─────────────────────────────────────────────

function validate(): ValidationResult {
  const stagedFiles = STAGED_ONLY || FILES_ARG ? getStagedFiles() : null;

  // Validate images
  const images = validateAssets(
    "image",
    CONFIG.image.extensions,
    CONFIG.image.dirs,
    CONFIG.image.maxSize,
    stagedFiles
  );

  // Validate videos
  const videos = validateAssets(
    "video",
    CONFIG.video.extensions,
    CONFIG.video.dirs,
    CONFIG.video.maxSize,
    stagedFiles
  );

  // Validate fonts
  const fonts = validateAssets(
    "font",
    CONFIG.font.extensions,
    CONFIG.font.dirs,
    CONFIG.font.maxSize,
    stagedFiles
  );

  // Check if too many font files
  const warnTooMany = fonts.total > CONFIG.font.maxFiles;

  const hasBlockers =
    images.issues.length > 0 ||
    videos.issues.length > 0 ||
    fonts.issues.length > 0;

  return {
    images,
    videos,
    fonts: { ...fonts, warnTooMany },
    passed: !hasBlockers,
  };
}

// ─────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────

function printResults(result: ValidationResult) {
  const mode = STAGED_ONLY ? "(Staged Files Only)" : "(All Files)";
  console.log(`\n\x1b[1mAsset Validation ${mode}\x1b[0m`);
  console.log("=".repeat(50));

  // Images
  console.log(
    `\n\x1b[1mImages\x1b[0m (max ${formatSize(CONFIG.image.maxSize)})`
  );
  console.log(`  Total: ${result.images.total} files`);
  if (result.images.issues.length === 0) {
    console.log(`  \x1b[32m✓ All images within size limit\x1b[0m`);
  } else {
    console.log(
      `  \x1b[31m✗ ${result.images.issues.length} oversized image(s):\x1b[0m`
    );
    for (const issue of result.images.issues) {
      console.log(
        `    \x1b[31m${issue.file}\x1b[0m: ${formatSize(issue.size)} (limit: ${formatSize(issue.maxSize)})`
      );
    }
    console.log(
      `\n  \x1b[36mFix: Compress images using squoosh.app or sharp\x1b[0m`
    );
    console.log(
      `  \x1b[36m     Convert to WebP/AVIF for better compression\x1b[0m`
    );
  }

  // Videos
  console.log(
    `\n\x1b[1mVideos\x1b[0m (max ${formatSize(CONFIG.video.maxSize)})`
  );
  console.log(`  Total: ${result.videos.total} files`);
  if (result.videos.issues.length === 0) {
    console.log(`  \x1b[32m✓ All videos within size limit\x1b[0m`);
  } else {
    console.log(
      `  \x1b[31m✗ ${result.videos.issues.length} oversized video(s):\x1b[0m`
    );
    for (const issue of result.videos.issues) {
      console.log(
        `    \x1b[31m${issue.file}\x1b[0m: ${formatSize(issue.size)} (limit: ${formatSize(issue.maxSize)})`
      );
    }
    console.log(
      `\n  \x1b[36mFix: Compress video using HandBrake or FFmpeg\x1b[0m`
    );
    console.log(
      `  \x1b[36m     Consider streaming from CDN for large videos\x1b[0m`
    );
  }

  // Fonts
  console.log(
    `\n\x1b[1mFonts\x1b[0m (max ${formatSize(CONFIG.font.maxSize)} per file)`
  );
  console.log(`  Total: ${result.fonts.total} files`);
  if (result.fonts.issues.length === 0) {
    console.log(`  \x1b[32m✓ All fonts within size limit\x1b[0m`);
  } else {
    console.log(
      `  \x1b[31m✗ ${result.fonts.issues.length} oversized font(s):\x1b[0m`
    );
    for (const issue of result.fonts.issues) {
      console.log(
        `    \x1b[31m${issue.file}\x1b[0m: ${formatSize(issue.size)} (limit: ${formatSize(issue.maxSize)})`
      );
    }
    console.log(
      `\n  \x1b[36mFix: Use next/font for automatic font optimization\x1b[0m`
    );
    console.log(
      `  \x1b[36m     Subset fonts to include only needed characters\x1b[0m`
    );
  }

  if (result.fonts.warnTooMany) {
    console.log(
      `\n  \x1b[33m⚠ Warning: ${result.fonts.total} font files detected (recommended: ≤${CONFIG.font.maxFiles})\x1b[0m`
    );
    console.log(`  \x1b[36m  Consider reducing font weights/variants\x1b[0m`);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  if (result.passed) {
    console.log("\x1b[32m\x1b[1mAsset Validation: PASSED\x1b[0m\n");
  } else {
    const totalIssues =
      result.images.issues.length +
      result.videos.issues.length +
      result.fonts.issues.length;
    console.log(
      `\x1b[31m\x1b[1mAsset Validation: FAILED (${totalIssues} issue(s))\x1b[0m`
    );
    console.log("\nFix the oversized assets listed above before committing.\n");
    process.exit(1);
  }
}

// ─────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────

const result = validate();

// Skip if staged-only and no assets staged
if (
  (STAGED_ONLY || FILES_ARG) &&
  result.images.total === 0 &&
  result.videos.total === 0 &&
  result.fonts.total === 0
) {
  console.log("No asset files staged. Skipping asset validation.");
  process.exit(0);
}

printResults(result);
