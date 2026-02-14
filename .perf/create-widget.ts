/**
 * Widget Scaffolding CLI
 *
 * Generates a complete widget directory with the correct structure
 * that passes all validation checks out of the box.
 *
 * Also auto-registers the widget in:
 * - src/widgets/{scope}/index.ts (export)
 * - src/core/constants/register-widgets.ts (type constant)
 * - src/core/widget-registry-setup.ts (registry registration)
 *
 * Usage: bun .perf/create-widget.ts
 * Interactive prompts will guide you through widget creation.
 *
 * Non-interactive: bun .perf/create-widget.ts --scope=common --name=MyWidget
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { createInterface } from "readline";

const WIDGETS_DIR = join(process.cwd(), "src/widgets");
const REGISTER_WIDGETS_PATH = join(
  process.cwd(),
  "src/core/constants/register-widgets.ts"
);
const WIDGET_REGISTRY_SETUP_PATH = join(
  process.cwd(),
  "src/core/widget-registry-setup.ts"
);

// Colors for console output
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

// ── Parse CLI args ──
function parseArgs(): {
  scope?: string;
  name?: string;
  skipRegister?: boolean;
} {
  const args: { scope?: string; name?: string; skipRegister?: boolean } = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--scope=")) args.scope = arg.split("=")[1];
    if (arg.startsWith("--name=")) args.name = arg.split("=")[1];
    if (arg === "--skip-register") args.skipRegister = true;
  }
  return args;
}

// ── Prompt helper ──
function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── Validation ──
function isPascalCase(str: string): boolean {
  return /^[A-Z][a-zA-Z0-9]+$/.test(str);
}

function getExistingWidgetNames(): Set<string> {
  const names = new Set<string>();
  if (!existsSync(REGISTER_WIDGETS_PATH)) return names;

  const content = readFileSync(REGISTER_WIDGETS_PATH, "utf-8");
  const matches = content.matchAll(/(\w+):\s*["'](\w+)["']/g);
  for (const match of matches) {
    names.add(match[1]);
  }
  return names;
}

function getAvailableScopes(): string[] {
  if (!existsSync(WIDGETS_DIR)) return ["common"];
  const { readdirSync, statSync } = require("fs");
  const scopes: string[] = [];
  for (const entry of readdirSync(WIDGETS_DIR)) {
    const full = join(WIDGETS_DIR, entry);
    if (statSync(full).isDirectory() && !entry.startsWith(".")) {
      scopes.push(entry);
    }
  }
  return scopes.length > 0 ? scopes : ["common"];
}

// ── Auto-registration functions ──

/**
 * Add export to src/widgets/{scope}/index.ts
 */
function registerInScopeIndex(scope: string, name: string): boolean {
  const indexPath = join(WIDGETS_DIR, scope, "index.ts");

  if (!existsSync(indexPath)) {
    // Create the index file if it doesn't exist
    writeFileSync(indexPath, `export * from "./${name}";\n`, "utf-8");
    return true;
  }

  let content = readFileSync(indexPath, "utf-8");

  // Check if already exported
  if (content.includes(`"./${name}"`) || content.includes(`'./${name}'`)) {
    return false; // Already exists
  }

  // Add export at the end
  const exportLine = `export * from "./${name}";`;
  content = content.trimEnd() + "\n" + exportLine + "\n";
  writeFileSync(indexPath, content, "utf-8");
  return true;
}

/**
 * Add widget type to src/core/constants/register-widgets.ts
 */
function registerInConstants(name: string): boolean {
  if (!existsSync(REGISTER_WIDGETS_PATH)) {
    console.error(
      `  ${YELLOW}Warning: ${REGISTER_WIDGETS_PATH} not found${RESET}`
    );
    return false;
  }

  let content = readFileSync(REGISTER_WIDGETS_PATH, "utf-8");

  // Check if already registered
  if (content.includes(`${name}:`)) {
    return false; // Already exists
  }

  // Find the closing brace of REGISTER_WIDGETS object
  const closingBraceIndex = content.lastIndexOf("};");
  if (closingBraceIndex === -1) {
    console.error(
      `  ${YELLOW}Warning: Could not find REGISTER_WIDGETS closing brace${RESET}`
    );
    return false;
  }

  // Insert before the closing brace
  const newEntry = `  ${name}: "${name}",\n`;
  content =
    content.slice(0, closingBraceIndex) +
    newEntry +
    content.slice(closingBraceIndex);

  writeFileSync(REGISTER_WIDGETS_PATH, content, "utf-8");
  return true;
}

/**
 * Add import and registration to src/core/widget-registry-setup.ts
 */
function registerInWidgetRegistry(scope: string, name: string): boolean {
  if (!existsSync(WIDGET_REGISTRY_SETUP_PATH)) {
    console.error(
      `  ${YELLOW}Warning: ${WIDGET_REGISTRY_SETUP_PATH} not found${RESET}`
    );
    return false;
  }

  let content = readFileSync(WIDGET_REGISTRY_SETUP_PATH, "utf-8");

  // Check if already imported
  if (content.includes(`import { ${name} }`)) {
    return false; // Already exists
  }

  // 1. Add import statement after existing imports from @/widgets
  // Find the last import from @/widgets or a widget-related import
  const importLines = content.split("\n");
  let lastWidgetImportIndex = -1;

  for (let i = 0; i < importLines.length; i++) {
    if (
      importLines[i].includes('from "@/widgets') ||
      importLines[i].includes('from "../widgets')
    ) {
      lastWidgetImportIndex = i;
    }
  }

  if (lastWidgetImportIndex === -1) {
    // Find any import line as fallback
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].startsWith("import ")) {
        lastWidgetImportIndex = i;
      }
    }
  }

  // Insert import after the last widget import
  const importStatement = `import { ${name} } from "@/widgets/${scope}/${name}";`;
  importLines.splice(lastWidgetImportIndex + 1, 0, importStatement);
  content = importLines.join("\n");

  // 2. Add registration entry before the closing ]); of registerAll
  const registerAllEndPattern = /(\s*\]\);)\s*\n\}/;
  const match = content.match(registerAllEndPattern);

  if (!match) {
    console.error(
      `  ${YELLOW}Warning: Could not find registerAll closing bracket${RESET}`
    );
    return false;
  }

  const registrationEntry = `    {\n      type: REGISTER_WIDGETS.${name},\n      component: ${name},\n    },\n  `;

  content = content.replace(
    registerAllEndPattern,
    registrationEntry + match[1] + "\n}"
  );

  writeFileSync(WIDGET_REGISTRY_SETUP_PATH, content, "utf-8");
  return true;
}

// ── Template generators ──

function generateIndexTsx(name: string): string {
  return `"use client";

import React from "react";
import { ${name}Props } from "./types";
import { ${name}Variants } from "./variants";

/**
 * ${name} Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function ${name}({
  data,
  settings,
  className,
  locale,
}: ${name}Props) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ${name}Variants[variant as keyof typeof ${name}Variants];

  if (!VariantComponent) {
    console.warn(\`${name} variant "\${variant}" not found, using default\`);
    const DefaultComponent = ${name}Variants.default;
    return (
      <DefaultComponent
        data={data}
        settings={settings}
        className={className}
        locale={locale}
      />
    );
  }

  return (
    <VariantComponent
      data={data}
      settings={settings}
      className={className}
      locale={locale}
    />
  );
}
`;
}

function generateTypesTs(name: string, scope: string): string {
  // common scope uses relative import, other scopes use alias
  const importPath =
    scope === "common"
      ? `import { WidgetProps } from "../types";`
      : `import { WidgetProps } from "@/widgets/common/types";`;

  return `${importPath}

/**
 * ${name} widget settings
 */
export interface ${name}Settings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
}

/**
 * ${name} widget data
 */
export interface ${name}Data {
  // Define the data structure your widget receives from dataSources
}

/**
 * Props for the ${name} component
 */
export type ${name}Props = WidgetProps<${name}Data, ${name}Settings>;
`;
}

function generateVariantsTs(name: string): string {
  return `import React from "react";
import { ${name}Props } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ${name} variants
 */
export const ${name}Variants: Record<string, React.FC<${name}Props>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type ${name}VariantType = keyof typeof ${name}Variants;
`;
}

function generateV1IndexTsx(name: string): string {
  return `"use client";

import React, { memo } from "react";
import { ${name}Props } from "../types";

/**
 * ${name} V1 Component
 *
 * Initial variant implementation.
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
  locale,
}: ${name}Props) {
  return (
    <div className={className}>
      {/* Your widget UI goes here */}
      <p>${name} Widget — V1</p>
    </div>
  );
});

export { V1 as default };
`;
}

// ── Main ──
async function main() {
  console.log(`\n${BOLD}  Widget Scaffolding${RESET}\n  ${"=".repeat(40)}\n`);

  const args = parseArgs();
  const availableScopes = getAvailableScopes();
  const existingNames = getExistingWidgetNames();

  // Get scope
  let scope = args.scope;
  if (!scope) {
    console.log(
      `  Available scopes: ${CYAN}${availableScopes.join(", ")}${RESET}\n`
    );
    scope = await prompt(`  Scope (${availableScopes.join("/")}): `);
  }

  if (!availableScopes.includes(scope)) {
    console.error(
      `\n  ${YELLOW}Error: Scope "${scope}" not found. Available: ${availableScopes.join(", ")}${RESET}\n`
    );
    process.exit(1);
  }

  // Get name
  let name = args.name;
  if (!name) {
    name = await prompt("  Widget name (PascalCase, e.g. HeroBanner): ");
  }

  if (!name || !isPascalCase(name)) {
    console.error(
      `\n  ${YELLOW}Error: Widget name must be PascalCase (e.g. HeroBanner, ProductSlider). Got: "${name}"${RESET}\n`
    );
    process.exit(1);
  }

  // Check for conflicts
  if (existingNames.has(name)) {
    console.error(
      `\n  ${YELLOW}Error: Widget "${name}" already exists in REGISTER_WIDGETS.${RESET}\n` +
        `  Choose a different name.\n`
    );
    process.exit(1);
  }

  const widgetDir = join(WIDGETS_DIR, scope, name);

  if (existsSync(widgetDir)) {
    console.error(
      `\n  ${YELLOW}Error: Directory already exists: src/widgets/${scope}/${name}/${RESET}\n`
    );
    process.exit(1);
  }

  // Create directory structure
  const v1Dir = join(widgetDir, "V1");
  mkdirSync(v1Dir, { recursive: true });

  // Generate files
  const files = [
    { path: join(widgetDir, "index.tsx"), content: generateIndexTsx(name) },
    {
      path: join(widgetDir, "types.ts"),
      content: generateTypesTs(name, scope),
    },
    {
      path: join(widgetDir, "variants.ts"),
      content: generateVariantsTs(name),
    },
    { path: join(v1Dir, "index.tsx"), content: generateV1IndexTsx(name) },
  ];

  for (const file of files) {
    writeFileSync(file.path, file.content, "utf-8");
  }

  // Success output - Widget files
  console.log(
    `\n${GREEN}  ✓ Created widget files:${RESET} src/widgets/${scope}/${name}/\n`
  );
  console.log(`    ${DIM}src/widgets/${scope}/${name}/${RESET}`);
  console.log(`    ├── index.tsx          ${DIM}(entry point)${RESET}`);
  console.log(
    `    ├── types.ts           ${DIM}(${name}Props, ${name}Data, ${name}Settings)${RESET}`
  );
  console.log(`    ├── variants.ts        ${DIM}(variant registry)${RESET}`);
  console.log(`    └── V1/`);
  console.log(`        └── index.tsx      ${DIM}(V1 component)${RESET}`);

  // Auto-registration (unless skipped)
  if (!args.skipRegister) {
    console.log(`\n${BOLD}  Auto-registering widget...${RESET}\n`);

    // 1. Register in scope index
    const scopeIndexUpdated = registerInScopeIndex(scope, name);
    if (scopeIndexUpdated) {
      console.log(
        `  ${GREEN}✓${RESET} Added export to ${CYAN}src/widgets/${scope}/index.ts${RESET}`
      );
    } else {
      console.log(
        `  ${DIM}• Export already exists in src/widgets/${scope}/index.ts${RESET}`
      );
    }

    // 2. Register in constants
    const constantsUpdated = registerInConstants(name);
    if (constantsUpdated) {
      console.log(
        `  ${GREEN}✓${RESET} Added ${CYAN}${name}${RESET} to ${CYAN}src/core/constants/register-widgets.ts${RESET}`
      );
    } else {
      console.log(`  ${DIM}• ${name} already in register-widgets.ts${RESET}`);
    }

    // 3. Register in widget registry setup
    const registryUpdated = registerInWidgetRegistry(scope, name);
    if (registryUpdated) {
      console.log(
        `  ${GREEN}✓${RESET} Registered in ${CYAN}src/core/widget-registry-setup.ts${RESET}`
      );
    } else {
      console.log(
        `  ${DIM}• Already registered in widget-registry-setup.ts${RESET}`
      );
    }

    console.log(
      `\n${GREEN}${BOLD}  ✅ Widget "${name}" is ready to use!${RESET}\n`
    );
    console.log(
      `  ${BOLD}Next step:${RESET} Add to a template's sections[].widgets[] array:\n`
    );
    console.log(`    ${CYAN}{`);
    console.log(`      type: REGISTER_WIDGETS.${name},`);
    console.log(`      settings: { variant: "v1" },`);
    console.log(`    }${RESET}\n`);
  } else {
    // Manual registration instructions (if --skip-register was used)
    console.log(`\n  ${YELLOW}Manual registration required:${RESET}\n`);
    console.log(
      `    1. Export in ${CYAN}src/widgets/${scope}/index.ts${RESET}:`
    );
    console.log(`       ${DIM}export * from "./${name}";${RESET}\n`);
    console.log(
      `    2. Add to ${CYAN}src/core/constants/register-widgets.ts${RESET}:`
    );
    console.log(`       ${DIM}${name}: "${name}",${RESET}\n`);
    console.log(
      `    3. Register in ${CYAN}src/core/widget-registry-setup.ts${RESET}:`
    );
    console.log(
      `       ${DIM}import { ${name} } from "@/widgets/${scope}/${name}";${RESET}`
    );
    console.log(
      `       ${DIM}{ type: REGISTER_WIDGETS.${name}, component: ${name} },${RESET}\n`
    );
  }

  console.log(
    `  ${DIM}Run ${CYAN}bun run perf:validate${DIM} to verify your widget structure.${RESET}\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
