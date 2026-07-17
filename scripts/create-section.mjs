#!/usr/bin/env node
/**
 * create:section <Name> — scaffold a PRD-shaped common section package.
 *
 * Generates widgets/common/<Name>/ (contract/logic/coverage/metadata/variants/
 * V1/i18n/preview/defaults/sample-data) + the editor preset pointer folder.
 * The generated coverage.ts is pre-declared `satisfies Record<keyof …>` so tsc
 * immediately lists every key still unclassified — the blueprint is the path
 * of least resistance, not a convention to remember.
 *
 * Usage: bun run create:section FeatureGrid
 * Reference implementation: src/widgets/common/Hero/
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const name = process.argv[2];
if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error("Usage: bun run create:section <PascalCaseName>");
  process.exit(1);
}
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/widgets/common", name);
if (existsSync(DIR)) {
  console.error(`✗ ${DIR} already exists`);
  process.exit(1);
}
const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/* ── section files ─────────────────────────────────────────────────────── */
const files = {
  "types.ts": `/* Section-level prop types (what the builder passes the widget). */
import type { WidgetProps } from "@/widgets/types";
import type { ${name}SharedSettings } from "./contract";

export interface ${name}Data {
  [key: string]: unknown;
}

export type ${name}Props = WidgetProps<${name}Data, ${name}SharedSettings>;
`,

  "contract.ts": `/* Editor schema + declared surface + VM — the stable spine. */
import type { V1Settings } from "./V1/types";

/** The shared, editor-facing settings surface (one field set, all variants). */
export interface ${name}SharedSettings {
  variant?: string;
  // TODO(port): shared semantic fields (promote when ≥2 variants use one)
  [key: string]: unknown; // native passthrough → routed into the extension
}

/**
 * The ${name} view-model. Variants receive ONLY this (never raw settings).
 * Typed extensions = each variant's faithful native settings interface.
 */
export interface ${name}VM {
  variant: "v1";
  shared: {
    // TODO(port): semantic groups (content / layout / appearance)
  };
  v1?: V1Settings;
}

export const ${name}Contract = {
  type: "${name}",
  name: "${name}",
  description: "TODO(port): one-line section description",
  /** Every data-testid the section renders (normalized across variants). */
  testIds: ["${kebab}"] as const,
  /** Block types accepted in a content region (empty = no block region). */
  acceptedBlocks: [] as const,
  /** Data need declaration. */
  data: { required: false } as const,
  settingsSchema: {
    variant: {
      type: "select" as const,
      label: "Widget Variant",
      options: [{ value: "v1", label: "Version 1" }],
      default: "v1",
    },
  },
} as const;

export default ${name}Contract;
`,

  "logic.ts": `import type { ${name}Data } from "./types";
import type { ${name}SharedSettings, ${name}VM } from "./contract";
import type { V1Settings } from "./V1/types";

const SHARED_KEYS = ["variant"] as const;

const nativeRest = (s: ${name}SharedSettings) => {
  const rest: Record<string, unknown> = { ...s };
  for (const k of SHARED_KEYS) delete rest[k];
  return rest;
};

function toV1Ext(s: ${name}SharedSettings): V1Settings {
  // TODO(port): map shared fields → this look's native settings
  return { ...nativeRest(s) } as V1Settings;
}

/**
 * The section's single logic entry — pure and server-safe.
 * Add useSectionLogic ONLY if this section has state/handlers (it wraps this).
 */
export function build${name}VM(
  data: ${name}Data | undefined,
  settings: ${name}SharedSettings | undefined
): ${name}VM {
  const s = settings ?? {};
  return { variant: "v1", shared: {}, v1: toV1Ext(s) };
}
`,

  "coverage.ts": `import type { V1Settings } from "./V1/types";

/**
 * Settings-coverage maps — the COMPILER-ENFORCED parity gate.
 * tsc lists every unclassified key the moment V1Settings gains one.
 */
export type SettingsCoverage = "shared" | "passthrough" | "generated";

export const V1_COVERAGE = {
  variant: "shared",
} satisfies Record<keyof V1Settings, SettingsCoverage>;
`,

  "metadata.ts": `import type { VariantMetadata } from "../../section-metadata";

/** Variant metadata (PRD §7.3 minus source_theme — provenance in local docs). */
export const ${name}Metadata: Record<"v1", VariantMetadata> = {
  v1: {
    variant_key: "v1",
    name: "TODO(port)",
    preview_image: "preview/v1.png",
    industries: ["general"],
    vibes: ["minimal"],
    goals: [],
    content_density: "balanced",
    page_types: ["homepage"],
  },
};
`,

  "variants.ts": `import type React from "react";
import dynamic from "next/dynamic";
import type { ${name}VM } from "./contract";

/** Props every variant receives — the VM seam (never raw settings). */
export interface ${name}VariantProps {
  vm: ${name}VM;
  className?: string;
  locale?: string;
}

// Each look is a lazy chunk (SSR stays on) so a storefront only downloads the
// variant its template actually renders — the others never reach the shopper.
const V1 = dynamic(() => import("./V1").then((m) => m.V1));

export const ${name}Variants: Record<
  string,
  React.ComponentType<${name}VariantProps>
> = {
  v1: V1,
  default: V1,
};
`,

  "index.tsx": `"use client";

import React from "react";
import { resolveLogic } from "../../_resolve";
import type { ${name}Props } from "./types";
import { build${name}VM } from "./logic";
import { ${name}Variants } from "./variants";

/** ${name} — common storefront section (see contract.ts for the surface). */
export function ${name}({ data, settings, className, locale }: ${name}Props) {
  const build = resolveLogic("${name}", build${name}VM);
  const vm = build(data, settings);
  const VariantComponent = ${name}Variants[vm.variant] ?? ${name}Variants.default;
  return <VariantComponent vm={vm} className={className} locale={locale} />;
}

export default ${name};
`,

  "defaults.ts": `import type { ${name}SharedSettings } from "./contract";

/** Seeds the editor palette preset — real values, not blanks. */
export const ${name}Defaults: ${name}SharedSettings = {
  variant: "v1",
};
`,

  "V1/sample-data.ts": `/* Per-variant fallback content — the section must look GREAT with zero
   settings (settings → data → sample fall-through). See Hero's V*/sample-data
   for the pattern. */
export const SAMPLE = {};
`,

  "V1/types.ts": `/** This look's faithful native settings (the vm.v1 typed extension). */
export interface V1Settings {
  variant?: string;
  // TODO(port): the source look's settings, key for key
}
`,

  "V1/index.tsx": `import React from "react";
import type { ${name}VariantProps } from "../variants";

export function V1({ vm, className }: ${name}VariantProps) {
  const settings = vm.v1; // the VM seam: read only the extension
  void settings; // TODO(port): remove once used
  return (
    <section data-testid="${kebab}" className={className}>
      {/* TODO(port): faithful markup of the source look */}
    </section>
  );
}

export { V1 as default };
`,

  "i18n/en.json": `{}
`,

  "preview/README.md": `One image per variant (800px wide): v1.png, v2.png, …
Required by the check:parity gate before commit. Also copy the lead image to
public/common/section-previews/${kebab}.png (the palette thumbnail).
`,
};

for (const [rel, content] of Object.entries(files)) {
  const p = join(DIR, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

/* ── editor preset pointer folder ──────────────────────────────────────── */
const presetDir = join(ROOT, "src/editor-integration/sections/common", kebab);
mkdirSync(presetDir, { recursive: true });
writeFileSync(
  join(presetDir, "section.ts"),
  `import { ${name}Defaults } from "@/widgets/common/${name}/defaults";

export const ${name.charAt(0).toLowerCase() + name.slice(1)}Section = {
  name: "${name}",
  type: "${name}",
  settings: { ...${name}Defaults },
};

export default ${name.charAt(0).toLowerCase() + name.slice(1)}Section;
`
);
writeFileSync(
  join(presetDir, "index.ts"),
  `import sectionDef from "./section";
// Canonical strings live IN the section folder (portable unit); this preset
// is a thin app-side pointer.
import enTranslations from "@/widgets/common/${name}/i18n/en.json";

export default {
  ...sectionDef,
  previewImage: "/common/section-previews/${kebab}.png",
  previewAlt: "${name}",
  defaultTranslations: {
    en: enTranslations,
  },
};
`
);

console.log(`✓ scaffolded src/widgets/common/${name}/ + editor preset sections/common/${kebab}/

Finish the wiring (two one-liners + generate):

  1. src/editor-integration/widget-registry.ts
       import { ${name}Contract } from "@/widgets/common/${name}/contract";
       → add  [WIDGET_TYPES.${name}]: ${name}Contract  to commonWidgetSchemas
  2. src/editor-integration/registries/available-sections-registry.ts
       import ${name.charAt(0).toLowerCase() + name.slice(1)} from "@/editor-integration/sections/common/${kebab}";
       → add it to the registry object
  3. bun run generate:widgets && bun run check:parity && tsc --noEmit
     (coverage/TODO markers + the parity gate will guide the port)

Copy-paste verify when done:
  rm -rf ../momsco/src/widgets/common/${name} && cp -R src/widgets/common/${name} ../momsco/src/widgets/common/
`);
