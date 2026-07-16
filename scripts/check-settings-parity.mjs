#!/usr/bin/env node
/**
 * Settings-coverage gate for common widgets — existence check only.
 *
 * The REAL enforcement is the type system: each variant-based section ships a
 * `coverage.ts` whose maps are declared
 *   `satisfies Record<keyof <VariantSettings>, SettingsCoverage>`
 * so tsc fails the moment a variant gains a settings key nobody classified
 * (shared / passthrough / generated). tsc already runs in pre-commit
 * (check-types + build).
 *
 * The one thing tsc cannot enforce is that a NEW section creates coverage.ts
 * at all — a section without the file compiles fine. This script closes that
 * hole: every common/<Widget>/ with per-variant settings (any VN/types.ts —
 * the ported-section pattern) must have a coverage.ts containing at least one
 * `satisfies Record<keyof` declaration. Legacy single-variant sections with a
 * root types.ts only (Header, Footer, …) are out of scope.
 *
 * Run: npm run check:parity (wired into both pre-commit hooks).
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const COMMON_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/widgets/common"
);

let failed = false;

const widgets = readdirSync(COMMON_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
  .map((e) => e.name);

for (const widget of widgets) {
  const widgetDir = join(COMMON_DIR, widget);
  const variantTypeFiles = readdirSync(widgetDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^V\d+$/.test(e.name))
    .map((e) => join(widgetDir, e.name, "types.ts"))
    .filter((p) => existsSync(p));

  // Only ported sections with per-variant settings surfaces are in scope.
  if (variantTypeFiles.length === 0) continue;

  const coveragePath = join(widgetDir, "coverage.ts");
  if (!existsSync(coveragePath)) {
    console.error(
      `✗ ${widget}: missing coverage.ts — classify every variant's settings keys\n` +
        `  (export maps declared \`satisfies Record<keyof <VariantSettings>, SettingsCoverage>\`;\n` +
        `   see common/Hero/coverage.ts for the pattern)`
    );
    failed = true;
    continue;
  }

  const source = readFileSync(coveragePath, "utf8");
  if (!source.includes("satisfies Record<keyof")) {
    console.error(
      `✗ ${widget}: coverage.ts exists but has no \`satisfies Record<keyof ...>\` ` +
        `declaration — without it tsc cannot enforce completeness`
    );
    failed = true;
    continue;
  }

  const metadataPath = join(widgetDir, "metadata.ts");
  if (!existsSync(metadataPath)) {
    console.error(
      `✗ ${widget}: missing metadata.ts (10-field variant metadata — see common/Hero/metadata.ts)`
    );
    failed = true;
    continue;
  }

  const previewDir = join(widgetDir, "preview");
  const previews = existsSync(previewDir)
    ? readdirSync(previewDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    : [];
  if (previews.length === 0) {
    console.error(
      `✗ ${widget}: preview/ has no images (one per variant — editor picker + AI need them)`
    );
    failed = true;
    continue;
  }

  console.log(
    `✓ ${widget}: coverage.ts + metadata.ts + ${previews.length} preview(s)`
  );
}

process.exit(failed ? 1 : 0);
