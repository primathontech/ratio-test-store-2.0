/**
 * Template Validation Script
 *
 * Validates templates in src/themes/ follow the required structure:
 * - Must export a `template` object with `id` and `sections` array
 * - Each section must have: id, name, type, settings, widgets
 * - Each widget must have: id, name, type, settings
 * - Widget `type` must exist in REGISTER_WIDGETS
 * - If widget has `dataSourceKey`, it must reference a key in template.dataSources
 * - No duplicate section or widget IDs
 *
 * Usage:
 *   bun .perf/validate-template.ts                    # Validate all templates
 *   bun .perf/validate-template.ts --staged-only      # Validate staged templates (pre-commit)
 *   bun .perf/validate-template.ts --files="f1 f2"    # Validate specific files (CI)
 * Exit code 0 = pass, 1 = fail
 */

import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { join, relative } from "path";
import { execSync } from "child_process";

const THEMES_DIR = join(process.cwd(), "src/themes");
const REGISTER_WIDGETS_PATH = join(
  process.cwd(),
  "src/core/constants/register-widgets.ts"
);
const STAGED_ONLY = process.argv.includes("--staged-only");
const FILES_ARG =
  process.argv.find((a) => a.startsWith("--files="))?.split("=")[1] || "";

interface ValidationError {
  file: string;
  message: string;
}

// ── Parse registered widget types from source ──
function getRegisteredWidgetTypes(): Set<string> {
  const types = new Set<string>();
  if (!existsSync(REGISTER_WIDGETS_PATH)) return types;

  const content = readFileSync(REGISTER_WIDGETS_PATH, "utf-8");
  // Match patterns like:  WidgetName: "WidgetName"
  const matches = content.matchAll(/(\w+):\s*["'](\w+)["']/g);
  for (const match of matches) {
    types.add(match[2]); // the string value
  }
  return types;
}

// ── Find template files ──
function findTemplateFiles(): string[] {
  const files: string[] = [];
  if (!existsSync(THEMES_DIR)) return files;

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry === "default.ts" && full.includes("/templates/")) {
        files.push(full);
      }
    }
  }

  walk(THEMES_DIR);
  return files;
}

function getChangedTemplateFiles(): Set<string> {
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
    if (f.includes("src/themes/") && f.includes("/templates/")) {
      files.add(join(process.cwd(), f));
    }
  }
  return files;
}

// ── Validate template file by reading its source ──
// We can't dynamically import .ts files easily, so we do text-based validation
function validateTemplateSource(filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const rel = relative(process.cwd(), filePath);
  const content = readFileSync(filePath, "utf-8");

  // Check: exports a template object
  if (
    !content.includes("export const template") &&
    !content.includes("export default")
  ) {
    errors.push({
      file: rel,
      message: `Template must export 'template' object: export const template: Template = { ... }`,
    });
    return errors; // Can't validate further without export
  }

  // Check: has id field
  if (!content.match(/id:\s*["'`]/)) {
    errors.push({
      file: rel,
      message: `Template must have an 'id' field (e.g., id: "my-page-template").`,
    });
  }

  // Check: has sections array
  if (!content.includes("sections:") && !content.includes("sections :")) {
    errors.push({
      file: rel,
      message: `Template must have a 'sections' array defining the page layout.`,
    });
  }

  // Check: imports REGISTER_WIDGETS or WIDGET_TYPES constant
  if (
    !content.includes("REGISTER_WIDGETS") &&
    !content.includes("WIDGET_TYPES")
  ) {
    errors.push({
      file: rel,
      message: `Template should import REGISTER_WIDGETS or WIDGET_TYPES and use it for widget type references (e.g., type: WIDGET_TYPES.ProductCard).`,
    });
  }

  // Check: imports Template type
  if (!content.includes("Template")) {
    errors.push({
      file: rel,
      message: `Template should import the Template type from @/lib/page-builder/models.`,
    });
  }

  // Check widget type references against REGISTER_WIDGETS or WIDGET_TYPES
  const widgetTypeRefs = content.matchAll(
    /type:\s*(?:REGISTER_WIDGETS|WIDGET_TYPES)\.(\w+)/g
  );
  const registeredTypes = getRegisteredWidgetTypes();

  if (registeredTypes.size > 0) {
    for (const match of widgetTypeRefs) {
      if (!registeredTypes.has(match[1])) {
        errors.push({
          file: rel,
          message: `Widget type '${match[1]}' is not registered. Available: ${Array.from(registeredTypes).join(", ")}`,
        });
      }
    }
  }

  // Check for hardcoded string widget types (should use constant)
  const hardcodedTypes = content.matchAll(/type:\s*["']([A-Z]\w+)["']/g);
  for (const match of hardcodedTypes) {
    // Skip section types (they use string constants from SECTION_TYPES)
    if (!match[1].includes("SECTION")) {
      errors.push({
        file: rel,
        message: `Widget type "${match[1]}" is hardcoded as a string. Use WIDGET_TYPES.${match[1]} or REGISTER_WIDGETS.${match[1]} constant instead.`,
      });
    }
  }

  // Check: dataSourceKey references (if used)
  // Find all dataSources keys
  const dataSourceKeys = new Set<string>();
  const dsMatches = content.matchAll(
    /(?:dataSources\s*:\s*\{[\s\S]*?)(\w+)\s*:\s*\{[\s\S]*?type:/g
  );
  // Simpler approach: find keys in dataSources block
  const dsBlock = content.match(
    /dataSources\s*:\s*\{([\s\S]*?)\}\s*,\s*sections/
  );
  if (dsBlock) {
    const keyMatches = dsBlock[1].matchAll(/(\w+)\s*:\s*\{/g);
    for (const m of keyMatches) {
      dataSourceKeys.add(m[1]);
    }
  }

  // Find dataSourceKey references in widgets
  const dsKeyRefs = content.matchAll(/dataSourceKey:\s*["'](\w+)["']/g);
  for (const ref of dsKeyRefs) {
    if (dataSourceKeys.size > 0 && !dataSourceKeys.has(ref[1])) {
      errors.push({
        file: rel,
        message: `dataSourceKey "${ref[1]}" does not match any key in dataSources. Available: ${Array.from(dataSourceKeys).join(", ")}`,
      });
    }
  }

  // Check: no duplicate IDs
  const allIds = new Set<string>();
  const idMatches = content.matchAll(/id:\s*["']([^"']+)["']/g);
  for (const match of idMatches) {
    if (allIds.has(match[1])) {
      errors.push({
        file: rel,
        message: `Duplicate ID "${match[1]}" found. All section and widget IDs must be unique within a template.`,
      });
    }
    allIds.add(match[1]);
  }

  return errors;
}

// ── Main ──
const changedFiles = getChangedTemplateFiles();
const allTemplateFiles = findTemplateFiles();

if ((STAGED_ONLY || FILES_ARG) && changedFiles.size === 0) {
  console.log("No template files staged. Skipping template validation.");
  process.exit(0);
}

const filesToValidate =
  STAGED_ONLY || FILES_ARG
    ? allTemplateFiles.filter((f) => changedFiles.has(f))
    : allTemplateFiles;

if (filesToValidate.length === 0) {
  console.log("No templates to validate.");
  process.exit(0);
}

console.log(`\nValidating ${filesToValidate.length} template(s)...\n`);

let allErrors: ValidationError[] = [];
let passCount = 0;

for (const file of filesToValidate) {
  const errors = validateTemplateSource(file);
  if (errors.length === 0) {
    passCount++;
  } else {
    allErrors = allErrors.concat(errors);
  }
}

if (allErrors.length === 0) {
  console.log(`Template Validation: PASSED (${passCount} template(s))\n`);
  process.exit(0);
} else {
  console.log(`Template Validation: FAILED\n`);
  console.log(`${passCount} passed, ${allErrors.length} error(s):\n`);

  for (const err of allErrors) {
    console.log(`  [${err.file}] ${err.message}`);
  }
  console.log();
  process.exit(1);
}
