/**
 * Widget Structure Validation Script
 *
 * Validates that widgets in src/widgets/ follow the required contract:
 * - Must have index.tsx (or index.ts), types.ts, variants.ts
 * - types.ts must reference WidgetProps
 * - variants.ts must export a default variant
 * - Must have at least one variant directory (V1/, V2/, etc.)
 *
 * Usage:
 *   bun .perf/validate-widget.ts                     # Validate all widgets
 *   bun .perf/validate-widget.ts --staged-only       # Validate only staged widgets (pre-commit)
 *   bun .perf/validate-widget.ts --files "file1.ts file2.ts"  # Validate specific files (CI)
 * Exit code 0 = pass, 1 = fail
 */

import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { join, basename } from "path";
import { execSync } from "child_process";

const WIDGETS_DIR = join(process.cwd(), "src/widgets");
const STAGED_ONLY = process.argv.includes("--staged-only");
const FILES_ARG =
  process.argv.find((a) => a.startsWith("--files="))?.split("=")[1] || "";

interface ValidationError {
  widget: string;
  message: string;
}

function getChangedWidgetDirs(): Set<string> {
  if (!STAGED_ONLY && !FILES_ARG) return new Set(); // validate all

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

  const widgetDirs = new Set<string>();
  for (const file of changedFiles) {
    // Match src/widgets/{scope}/{WidgetName}/...
    const match = file.match(/^src\/widgets\/([^/]+)\/([^/]+)\//);
    if (match) {
      widgetDirs.add(join(WIDGETS_DIR, match[1], match[2]));
    }
  }
  return widgetDirs;
}

function findWidgetDirs(baseDir: string): string[] {
  const dirs: string[] = [];
  if (!existsSync(baseDir)) return dirs;

  // src/widgets/{scope}/ (e.g., common/, wellversed/)
  for (const scope of readdirSync(baseDir)) {
    const scopePath = join(baseDir, scope);
    if (!statSync(scopePath).isDirectory()) continue;
    if (scope === "types.ts" || scope.startsWith(".")) continue;

    // src/widgets/{scope}/{WidgetName}/
    for (const widget of readdirSync(scopePath)) {
      const widgetPath = join(scopePath, widget);
      if (!statSync(widgetPath).isDirectory()) continue;
      dirs.push(widgetPath);
    }
  }
  return dirs;
}

function validateWidget(widgetDir: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const name = basename(widgetDir);

  // Check for entry point (index.tsx, index.ts, or {WidgetName}.tsx / {WidgetName}.ts)
  const hasIndexTsx = existsSync(join(widgetDir, "index.tsx"));
  const hasIndexTs = existsSync(join(widgetDir, "index.ts"));
  const hasNamedEntry =
    existsSync(join(widgetDir, `${name}.tsx`)) ||
    existsSync(join(widgetDir, `${name}.ts`));
  if (!hasIndexTsx && !hasIndexTs && !hasNamedEntry) {
    errors.push({
      widget: name,
      message: `Missing entry point — every widget must have index.tsx, index.ts, or ${name}.tsx that exports the component.`,
    });
  }

  // Check for types.ts
  const typesPath = join(widgetDir, "types.ts");
  if (!existsSync(typesPath)) {
    errors.push({
      widget: name,
      message: `Missing types.ts — every widget must define its props interface using WidgetProps<TData, TSettings>.`,
    });
  } else {
    // Check that types.ts references WidgetProps
    const typesContent = readFileSync(typesPath, "utf-8");
    if (!typesContent.includes("WidgetProps")) {
      errors.push({
        widget: name,
        message: `types.ts does not reference WidgetProps. Widget props must extend WidgetProps<TData, TSettings> from @/widgets/types.`,
      });
    }
  }

  // Check for variants.ts
  const variantsPath = join(widgetDir, "variants.ts");
  if (!existsSync(variantsPath)) {
    errors.push({
      widget: name,
      message: `Missing variants.ts — every widget must have a variant registry with at least a 'default' entry.`,
    });
  } else {
    // Check that variants.ts has a default export or 'default' key
    const variantsContent = readFileSync(variantsPath, "utf-8");
    if (
      !variantsContent.includes("default") &&
      !variantsContent.includes("Default")
    ) {
      errors.push({
        widget: name,
        message: `variants.ts does not define a 'default' variant. The variant registry must include a fallback.`,
      });
    }
  }

  // Check for at least one variant directory (V1/, V2/, etc.)
  const entries = readdirSync(widgetDir);
  const variantDirs = entries.filter((e) => {
    const full = join(widgetDir, e);
    return statSync(full).isDirectory() && /^V\d+$/i.test(e);
  });

  if (variantDirs.length === 0) {
    errors.push({
      widget: name,
      message: `No variant directory found (V1/, V2/, etc.). Every widget must have at least one variant implementation.`,
    });
  }

  return errors;
}

// ── Main ──

const changedDirs = getChangedWidgetDirs();
const allWidgetDirs = findWidgetDirs(WIDGETS_DIR);

// If --staged-only or --files and no widget files found, skip
if ((STAGED_ONLY || FILES_ARG) && changedDirs.size === 0) {
  console.log("No widget files staged. Skipping widget validation.");
  process.exit(0);
}

const dirsToValidate =
  STAGED_ONLY || FILES_ARG
    ? allWidgetDirs.filter((d) => changedDirs.has(d))
    : allWidgetDirs;

if (dirsToValidate.length === 0) {
  console.log("No widgets to validate.");
  process.exit(0);
}

let allErrors: ValidationError[] = [];
let passCount = 0;

console.log(`\nValidating ${dirsToValidate.length} widget(s)...\n`);

for (const dir of dirsToValidate) {
  const errors = validateWidget(dir);
  if (errors.length === 0) {
    passCount++;
  } else {
    allErrors = allErrors.concat(errors);
  }
}

// Report
if (allErrors.length === 0) {
  console.log(`Widget Structure Validation: PASSED (${passCount} widgets)\n`);
  process.exit(0);
} else {
  console.log(`Widget Structure Validation: FAILED\n`);
  console.log(`${passCount} passed, ${allErrors.length} error(s):\n`);

  for (const err of allErrors) {
    console.log(`  [${err.widget}] ${err.message}`);
  }

  console.log(
    `\nEvery widget must have: entry point (index.tsx or {WidgetName}.tsx), types.ts, variants.ts, and at least one V*/ directory.`
  );
  console.log(`types.ts must reference WidgetProps<TData, TSettings>.`);
  console.log(`variants.ts must include a 'default' variant.`);
  console.log(
    `Tip: Run 'bun run create:widget' to scaffold a correct widget structure.\n`
  );

  process.exit(1);
}
