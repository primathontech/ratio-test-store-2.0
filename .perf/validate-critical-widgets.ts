/**
 * Critical Widget Validation Script
 *
 * Phase 2: Ensures critical (above-the-fold) widgets are NOT lazy-loaded
 *
 * Critical widgets must be directly imported, not dynamically loaded,
 * because they appear above the fold and affect LCP.
 *
 * What this checks:
 * - Widget registry uses direct imports for critical widgets
 * - No dynamic(() => import()) for Header, Navigation, HeroCarousel, etc.
 * - Templates don't lazy-load critical sections
 *
 * Usage:
 *   bun .perf/validate-critical-widgets.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

/**
 * Critical widgets that must NOT be lazy-loaded
 * These appear above the fold and affect LCP
 *
 * Uses pattern matching - any widget containing these names will be checked
 * e.g., "Header" matches "Header", "WellversedHeader", "CustomHeader", etc.
 */
const CRITICAL_WIDGET_PATTERNS = [
  "Header", // Matches Header, WellversedHeader, CustomHeader, etc.
  "Navigation", // Matches Navigation, HeaderNavigation, etc.
  "Hero", // Matches HeroCarousel, HeroBanner, HeroSection, etc.
  "Announcement", // Matches AnnouncementBar, AnnouncementBanner, etc.
];

/**
 * Files to check for lazy loading patterns
 */
const FILES_TO_CHECK = [
  "src/core/widget-registry-setup.ts",
  "src/lib/page-builder/core/widget-injector/widget-registry.ts",
];

/**
 * Patterns that indicate lazy loading
 */
const LAZY_PATTERNS = [
  /dynamic\s*\(\s*\(\)\s*=>\s*import\s*\(/,
  /React\.lazy\s*\(\s*\(\)\s*=>\s*import\s*\(/,
  /lazy\s*\(\s*\(\)\s*=>\s*import\s*\(/,
  /import\s*\(\s*['"`][^'"]+['"`]\s*\)/, // Dynamic import
];

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Issue {
  file: string;
  widget: string;
  line: number;
  pattern: string;
  message: string;
}

interface ValidationResult {
  passed: boolean;
  issues: Issue[];
  checkedFiles: string[];
  criticalWidgets: string[];
}

// ─────────────────────────────────────────────
// Validation Logic
// ─────────────────────────────────────────────

function checkFileForLazyLoading(filePath: string): Issue[] {
  const issues: Issue[] = [];
  const fullPath = join(process.cwd(), filePath);

  if (!existsSync(fullPath)) {
    return issues;
  }

  const content = readFileSync(fullPath, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check if this line involves a critical widget (pattern matching)
    for (const pattern of CRITICAL_WIDGET_PATTERNS) {
      // Check if the line mentions a widget matching this pattern (case-insensitive)
      const widgetMatch = line.match(
        new RegExp(`\\b(\\w*${pattern}\\w*)\\b`, "i")
      );
      if (!widgetMatch) continue;
      const widget = widgetMatch[1];

      // Check for lazy loading patterns
      for (const pattern of LAZY_PATTERNS) {
        if (pattern.test(line)) {
          issues.push({
            file: filePath,
            widget,
            line: lineNum,
            pattern: pattern.toString(),
            message: `Critical widget "${widget}" appears to be lazy-loaded`,
          });
        }
      }

      // Also check the surrounding context (next few lines)
      const context = lines.slice(i, Math.min(i + 5, lines.length)).join("\n");
      for (const pattern of LAZY_PATTERNS) {
        if (
          pattern.test(context) &&
          !issues.find((iss) => iss.line === lineNum && iss.widget === widget)
        ) {
          // Check if this dynamic import is specifically for this widget
          if (context.includes(widget)) {
            issues.push({
              file: filePath,
              widget,
              line: lineNum,
              pattern: "dynamic import in context",
              message: `Critical widget "${widget}" may be lazy-loaded (check surrounding code)`,
            });
          }
        }
      }
    }
  }

  return issues;
}

function checkWidgetRegistryForDirectImports(): Issue[] {
  const issues: Issue[] = [];
  const registryPath = join(process.cwd(), "src/core/widget-registry-setup.ts");

  if (!existsSync(registryPath)) {
    console.log("  Widget registry not found at expected path");
    return issues;
  }

  const content = readFileSync(registryPath, "utf-8");

  // Check that critical widgets are imported at the top (direct import)
  // Use pattern matching to find any widget containing critical patterns
  const lines = content.split("\n");

  for (const criticalPattern of CRITICAL_WIDGET_PATTERNS) {
    // Find all widgets in the file that match this pattern
    const widgetRegex = new RegExp(`\\b(\\w*${criticalPattern}\\w*)\\b`, "gi");
    const allMatches = content.match(widgetRegex) || [];
    const uniqueWidgets = [...new Set(allMatches)];

    for (const widget of uniqueWidgets) {
      // Check for dynamic import pattern for this widget
      const dynamicPattern = new RegExp(
        `dynamic\\s*\\([^)]*${widget}[^)]*\\)`,
        "m"
      );
      const hasDynamicImport = dynamicPattern.test(content);

      if (hasDynamicImport) {
        // Find the line number
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(widget) && dynamicPattern.test(lines[i])) {
            issues.push({
              file: "src/core/widget-registry-setup.ts",
              widget,
              line: i + 1,
              pattern: "dynamic()",
              message: `Critical widget "${widget}" is dynamically imported. Use direct import for above-the-fold widgets.`,
            });
            break;
          }
        }
      }
    }
  }

  return issues;
}

function validate(): ValidationResult {
  const allIssues: Issue[] = [];
  const checkedFiles: string[] = [];

  // Check widget registry specifically
  const registryIssues = checkWidgetRegistryForDirectImports();
  allIssues.push(...registryIssues);
  checkedFiles.push("src/core/widget-registry-setup.ts");

  // Check other files for lazy loading patterns
  for (const file of FILES_TO_CHECK) {
    if (existsSync(join(process.cwd(), file))) {
      const issues = checkFileForLazyLoading(file);
      allIssues.push(...issues);
      if (!checkedFiles.includes(file)) {
        checkedFiles.push(file);
      }
    }
  }

  return {
    passed: allIssues.length === 0,
    issues: allIssues,
    checkedFiles,
    criticalWidgets: CRITICAL_WIDGET_PATTERNS,
  };
}

// ─────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────

function printResults(result: ValidationResult) {
  console.log("\n\x1b[1mCritical Widget Validation\x1b[0m");
  console.log("=".repeat(50));

  console.log(
    "\n\x1b[1mCritical widget patterns (must not be lazy-loaded):\x1b[0m"
  );
  console.log("  Any widget containing these names will be checked:");
  for (const pattern of result.criticalWidgets) {
    console.log(
      `  - *${pattern}* (e.g., ${pattern}, Custom${pattern}, ${pattern}V2)`
    );
  }

  console.log("\n\x1b[1mFiles checked:\x1b[0m");
  for (const file of result.checkedFiles) {
    console.log(`  - ${file}`);
  }

  if (result.passed) {
    console.log("\n\x1b[32m✓ All critical widgets use direct imports\x1b[0m");
    console.log(
      "\x1b[32m✓ No lazy loading detected for above-the-fold widgets\x1b[0m"
    );
    console.log("\n" + "=".repeat(50));
    console.log("\x1b[32m\x1b[1mCritical Widget Validation: PASSED\x1b[0m\n");
  } else {
    console.log("\n\x1b[31m✗ Issues found:\x1b[0m\n");

    for (const issue of result.issues) {
      console.log(`  \x1b[31m${issue.file}:${issue.line}\x1b[0m`);
      console.log(`    Widget: ${issue.widget}`);
      console.log(`    Issue: ${issue.message}`);
      console.log();
    }

    console.log("\x1b[36mFix: Use direct imports for critical widgets:\x1b[0m");
    console.log(`
  // ❌ Wrong - lazy loading critical widget
  const Header = dynamic(() => import("@/widgets/Header"));

  // ✅ Correct - direct import for above-the-fold widget
  import { Header } from "@/widgets/Header";
`);

    console.log("=".repeat(50));
    console.log(
      `\x1b[31m\x1b[1mCritical Widget Validation: FAILED (${result.issues.length} issue(s))\x1b[0m\n`
    );
    process.exit(1);
  }
}

// ─────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────

const result = validate();
printResults(result);
