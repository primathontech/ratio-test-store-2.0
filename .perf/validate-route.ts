/**
 * Route Validation Script
 *
 * Validates page routes in src/app/ follow the static generation contract:
 *
 * CATALOG PAGES (product/collection):
 * - Must use createPageBuildingEngine() + routeContext + TEMPLATE_TYPES
 * - Must have revalidate + generateStaticParams + dynamicParams
 * - Must be async server component
 *
 * STANDARD PAGES (home, etc.):
 * - Must use createPageBuildingEngine() + routeContext + TEMPLATE_TYPES
 * - Must be server component (no 'use client')
 *
 * STANDALONE PAGES (search, cart, checkout, etc.):
 * - Exempt from page builder requirement (render widgets directly)
 * - Must be server component (no 'use client')
 *
 * Usage:
 *   bun .perf/validate-route.ts                   # Validate all routes
 *   bun .perf/validate-route.ts --staged-only     # Validate staged routes (pre-commit)
 *   bun .perf/validate-route.ts --files="f1 f2"   # Validate specific files (CI)
 * Exit code 0 = pass, 1 = fail
 */

import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { join, relative, dirname } from "path";
import { execSync } from "child_process";

const APP_DIR = join(process.cwd(), "src/app");
const STAGED_ONLY = process.argv.includes("--staged-only");
const FILES_ARG =
  process.argv.find((a) => a.startsWith("--files="))?.split("=")[1] || "";

interface ValidationError {
  file: string;
  message: string;
  rule: string;
}

// ── Find all page.tsx files ──
function findPageFiles(): string[] {
  const files: string[] = [];
  if (!existsSync(APP_DIR)) return files;

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        // Skip api/, editor/, and _next directories
        if (
          entry === "api" ||
          entry === "editor" ||
          entry === "_next" ||
          entry.startsWith(".")
        ) {
          continue;
        }
        walk(full);
      } else if (entry === "page.tsx" || entry === "page.ts") {
        files.push(full);
      }
    }
  }

  walk(APP_DIR);
  return files;
}

function getChangedPageFiles(): Set<string> {
  if (!STAGED_ONLY && !FILES_ARG) return new Set();

  let changedFiles: string[] = [];

  // If --files is provided (CI mode), use those files
  if (FILES_ARG) {
    changedFiles = FILES_ARG.split(/\s+/).filter(Boolean);
  } else {
    // Otherwise use git staged files (local pre-commit)
    try {
      const output = execSync("git diff --cached --name-only", {
        encoding: "utf-8",
      });
      changedFiles = output.split("\n").filter(Boolean);
    } catch {
      return new Set();
    }
  }

  const files = new Set<string>();
  for (const f of changedFiles) {
    if (
      f.startsWith("src/app/") &&
      !f.startsWith("src/app/api/") &&
      !f.startsWith("src/app/editor/") &&
      (f.endsWith("/page.tsx") || f.endsWith("/page.ts"))
    ) {
      files.add(join(process.cwd(), f));
    }
  }
  return files;
}

// ── Check if route is dynamic (has [param] segment) ──
function isDynamicRoute(filePath: string): boolean {
  return filePath.includes("[") && filePath.includes("]");
}

// ── Check if route is a catalog page (product or collection) ──
// Only catalog pages need strict static generation requirements:
// - revalidate (ISR for fresh data)
// - generateStaticParams (pre-build known products/collections)
// - dynamicParams (allow new products/collections at runtime)
function isCatalogPage(filePath: string): boolean {
  const rel = relative(process.cwd(), filePath).toLowerCase();

  // Product pages: /products/[handle], /collections/[name]/products/[handle]
  const isProductPage =
    rel.includes("/products/[") || rel.includes("/products-b/[");

  // Collection pages: /collections/[collectionname]
  const isCollectionPage =
    rel.includes("/collections/[") && !rel.includes("/products/"); // exclude product pages under collections

  return isProductPage || isCollectionPage;
}

// ── Check if route is a standalone page (exempt from page builder) ──
// Standalone pages render widgets directly without the page builder engine.
// They still must be server components but don't need routeContext/TEMPLATE_TYPES.
// Examples: search (uses searchParams), cart, checkout, account pages
function isStandalonePage(filePath: string): boolean {
  const rel = relative(process.cwd(), filePath).toLowerCase();

  const standalonePatterns = [
    "/pages/search/", // Search page — uses searchParams for dynamic queries
    "/search/page.", // Alternative search path
    "/pages/cart/", // Cart page — client-side state
    "/cart/page.",
    "/pages/checkout/", // Checkout page
    "/checkout/page.",
    "/pages/account/", // Account pages
    "/account/page.",
  ];

  return standalonePatterns.some((pattern) => rel.includes(pattern));
}

// ── Validate a page file ──
function validatePage(filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const rel = relative(process.cwd(), filePath);
  const content = readFileSync(filePath, "utf-8");

  // S7: Must NOT have 'use client' (applies to ALL pages)
  if (content.includes("'use client'") || content.includes('"use client"')) {
    errors.push({
      file: rel,
      rule: "S7",
      message: `[STATIC] Page files must be server components. Remove 'use client'. Move client-side logic (hooks, state, event handlers) into widget components.`,
    });
  }

  // Standalone pages (search, cart, checkout, etc.) are exempt from page builder requirements
  // They can render widgets directly and use searchParams/client-side state
  const isStandalone = isStandalonePage(filePath);

  if (!isStandalone) {
    // S8: Must use page builder engine
    if (
      !content.includes("createPageBuildingEngine") &&
      !content.includes("getPageBuilder")
    ) {
      errors.push({
        file: rel,
        rule: "S8",
        message: `[STATIC] Pages must use the page builder engine. Import and call getPageBuilder() or createPageBuildingEngine() to render pages. Do not render widgets directly.`,
      });
    }

    // Must define routeContext
    if (!content.includes("routeContext")) {
      errors.push({
        file: rel,
        rule: "S8",
        message: `[STATIC] Page must define a routeContext with templateName for the page builder.`,
      });
    }

    // Must use TEMPLATE_TYPES constant
    if (
      content.includes("routeContext") &&
      !content.includes("TEMPLATE_TYPES")
    ) {
      errors.push({
        file: rel,
        rule: "S8",
        message: `[STATIC] routeContext.templateName must use TEMPLATE_TYPES constant (e.g., TEMPLATE_TYPES.PRODUCTS). Do not hardcode template names.`,
      });
    }
  }

  // S5 & S6: Catalog pages (product/collection) have strict requirements
  // Other pages are more flexible
  if (isCatalogPage(filePath)) {
    // S5: Catalog pages must have revalidate for ISR
    if (!content.includes("export const revalidate")) {
      errors.push({
        file: rel,
        rule: "S5",
        message: `[STATIC] Product/Collection page is missing ISR configuration. Add: export const revalidate = 3600; This ensures fresh pricing/inventory data.`,
      });
    }

    // S6: Catalog pages must have generateStaticParams
    if (!content.includes("generateStaticParams")) {
      errors.push({
        file: rel,
        rule: "S6",
        message: `[STATIC] Product/Collection route is missing generateStaticParams. Catalog pages must be pre-rendered at build time. Add: export async function generateStaticParams() { ... }`,
      });
    }

    // S6: Catalog pages should have dynamicParams
    if (!content.includes("dynamicParams")) {
      errors.push({
        file: rel,
        rule: "S6",
        message: `[STATIC] Product/Collection route should export dynamicParams. Add: export const dynamicParams = true; This allows runtime generation for new products/collections.`,
      });
    }
  }

  // Must be async function (server component pattern)
  // Exception: standalone pages can be sync if they don't need async data fetching
  if (!isStandalone) {
    if (!content.match(/export\s+default\s+async\s+function/)) {
      errors.push({
        file: rel,
        rule: "S8",
        message: `[STATIC] Page must export an async function as default. Pattern: export default async function PageName() { ... }`,
      });
    }
  }

  return errors;
}

// ── Main ──
const changedFiles = getChangedPageFiles();
const allPageFiles = findPageFiles();

if ((STAGED_ONLY || FILES_ARG) && changedFiles.size === 0) {
  console.log("No page route files staged. Skipping route validation.");
  process.exit(0);
}

const filesToValidate =
  STAGED_ONLY || FILES_ARG
    ? allPageFiles.filter((f) => changedFiles.has(f))
    : allPageFiles;

if (filesToValidate.length === 0) {
  console.log("No page routes to validate.");
  process.exit(0);
}

console.log(`\nValidating ${filesToValidate.length} page route(s)...\n`);

let allErrors: ValidationError[] = [];
let passCount = 0;

for (const file of filesToValidate) {
  const errors = validatePage(file);
  if (errors.length === 0) {
    passCount++;
    console.log(`  PASS  ${relative(process.cwd(), file)}`);
  } else {
    allErrors = allErrors.concat(errors);
  }
}

if (allErrors.length === 0) {
  console.log(`\nRoute Validation: PASSED (${passCount} route(s))\n`);
  process.exit(0);
} else {
  console.log(`\nRoute Validation: FAILED\n`);
  console.log(`${passCount} passed, ${allErrors.length} error(s):\n`);

  for (const err of allErrors) {
    console.log(`  [${err.rule}] ${err.file}`);
    console.log(`       ${err.message}\n`);
  }

  console.log(`Standard pages must:`);
  console.log(`  - Be server components (no 'use client')`);
  console.log(`  - Use createPageBuildingEngine() for rendering`);
  console.log(`  - Define routeContext with TEMPLATE_TYPES constant`);
  console.log(`  - Export an async default function`);
  console.log();
  console.log(`Product/Collection pages additionally must:`);
  console.log(
    `  - Export revalidate for ISR (e.g., export const revalidate = 3600)`
  );
  console.log(`  - Export generateStaticParams to pre-build catalog pages`);
  console.log(`  - Export dynamicParams = true for new products/collections`);
  console.log();
  console.log(`Standalone pages (search, cart, checkout, account):`);
  console.log(`  - Exempt from page builder requirement`);
  console.log(`  - Must still be server components (no 'use client')`);
  console.log();

  process.exit(1);
}
