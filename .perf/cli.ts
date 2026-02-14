#!/usr/bin/env bun
/**
 * Unified CLI for Agency Developers
 *
 * A single entry point for all scaffolding and management tasks:
 * - Create themes
 * - Create widgets (with auto-registration)
 * - Add widgets to templates
 *
 * Usage:
 *   bun .perf/cli.ts                    # Interactive menu
 *   bun .perf/cli.ts create:theme       # Create a new theme
 *   bun .perf/cli.ts create:widget      # Create a new widget
 *   bun .perf/cli.ts add:widget         # Add widget to template
 */

import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join } from "path";
import { createInterface } from "readline";

// ─────────────────────────────────────────────
// Constants & Paths
// ─────────────────────────────────────────────

const ROOT = process.cwd();
const THEMES_DIR = join(ROOT, "src/themes");
const WIDGETS_DIR = join(ROOT, "src/widgets");
const CONSTANTS_DIR = join(ROOT, "src/constants");
const CORE_CONSTANTS_DIR = join(ROOT, "src/core/constants");
const WIDGET_REGISTRY_PATH = join(ROOT, "src/core/widget-registry-setup.ts");
const REGISTER_WIDGETS_PATH = join(CORE_CONSTANTS_DIR, "register-widgets.ts");
const THEME_CONSTANTS_PATH = join(CONSTANTS_DIR, "theme-constants.ts");

// Colors
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function promptSelect(
  question: string,
  options: string[]
): Promise<string> {
  console.log(`\n  ${question}\n`);
  options.forEach((opt, i) => {
    console.log(`    ${CYAN}${i + 1}.${RESET} ${opt}`);
  });
  console.log();
  const answer = await prompt(`  Enter choice (1-${options.length}): `);
  const index = parseInt(answer) - 1;
  if (index >= 0 && index < options.length) {
    return options[index];
  }
  console.log(`  ${YELLOW}Invalid choice, using first option.${RESET}`);
  return options[0];
}

function isPascalCase(str: string): boolean {
  return /^[A-Z][a-zA-Z0-9]+$/.test(str);
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function getExistingThemes(): string[] {
  if (!existsSync(THEMES_DIR)) return [];
  return readdirSync(THEMES_DIR).filter((f) => {
    const full = join(THEMES_DIR, f);
    return statSync(full).isDirectory() && !f.startsWith(".");
  });
}

function getExistingWidgetScopes(): string[] {
  if (!existsSync(WIDGETS_DIR)) return ["common"];
  return readdirSync(WIDGETS_DIR).filter((f) => {
    const full = join(WIDGETS_DIR, f);
    return statSync(full).isDirectory() && !f.startsWith(".");
  });
}

function getExistingWidgets(): string[] {
  if (!existsSync(REGISTER_WIDGETS_PATH)) return [];
  const content = readFileSync(REGISTER_WIDGETS_PATH, "utf-8");
  const matches = content.matchAll(/(\w+):\s*["'](\w+)["']/g);
  return [...matches].map((m) => m[1]);
}

function getTemplatesForTheme(themeName: string): string[] {
  const templatesDir = join(THEMES_DIR, themeName, "templates");
  if (!existsSync(templatesDir)) return [];
  return readdirSync(templatesDir).filter((f) => {
    const full = join(templatesDir, f);
    return statSync(full).isDirectory() && !f.startsWith(".");
  });
}

// ─────────────────────────────────────────────
// Theme Creation
// ─────────────────────────────────────────────

async function createTheme() {
  console.log(`\n${BOLD}  🎨 Create New Theme${RESET}\n  ${"─".repeat(40)}\n`);

  // Get merchant name
  const merchantName = await prompt("  Merchant name (e.g., Acme Store): ");
  if (!merchantName) {
    console.log(`  ${RED}Error: Merchant name is required.${RESET}\n`);
    process.exit(1);
  }

  // Generate theme ID from merchant name
  const themeId = toKebabCase(
    merchantName.replace(/[^a-zA-Z0-9\s]/g, "").trim()
  );
  const themeConstantName = merchantName
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  console.log(`\n  ${DIM}Theme ID: ${themeId}${RESET}`);
  console.log(`  ${DIM}Constant: THEMES.${themeConstantName}${RESET}\n`);

  // Check if theme exists
  const themeDir = join(THEMES_DIR, themeId);
  if (existsSync(themeDir)) {
    console.log(`  ${RED}Error: Theme "${themeId}" already exists.${RESET}\n`);
    process.exit(1);
  }

  // Get supported languages
  const defaultLang = (await prompt("  Default language (en): ")) || "en";

  // Create theme directory structure
  console.log(`\n${BOLD}  Creating theme structure...${RESET}\n`);

  const dirs = [
    themeDir,
    join(themeDir, "templates"),
    join(themeDir, "templates", "home"),
    join(themeDir, "templates", "products"),
    join(themeDir, "templates", "collection"),
    join(themeDir, "locales"),
    join(themeDir, "locales", "common"),
    join(themeDir, "locales", "pages"),
    join(themeDir, "locales", "pages", "home"),
  ];

  for (const dir of dirs) {
    mkdirSync(dir, { recursive: true });
  }

  // Generate theme files
  const files = [
    {
      path: join(themeDir, "theme-registry.ts"),
      content: generateThemeRegistry(themeId, themeConstantName),
    },
    {
      path: join(themeDir, "templates", "home", "default.ts"),
      content: generateHomeTemplate(themeId, themeConstantName, merchantName),
    },
    {
      path: join(themeDir, "templates", "home", "constant.ts"),
      content: generateTemplateConstants(merchantName),
    },
    {
      path: join(themeDir, "templates", "variant-registry.ts"),
      content: generateVariantRegistry(themeConstantName),
    },
    {
      path: join(themeDir, "locales", "common", `${defaultLang}.json`),
      content: generateCommonLocale(merchantName),
    },
    {
      path: join(themeDir, "locales", "pages", "home", `${defaultLang}.json`),
      content: generateHomeLocale(merchantName),
    },
    {
      path: join(themeDir, "theme.json"),
      content: JSON.stringify(
        {
          id: themeId,
          name: merchantName,
          version: "1.0.0",
          supportedLanguages: [defaultLang],
          defaultLanguage: defaultLang,
        },
        null,
        2
      ),
    },
  ];

  for (const file of files) {
    writeFileSync(file.path, file.content, "utf-8");
    console.log(`  ${GREEN}✓${RESET} ${file.path.replace(ROOT + "/", "")}`);
  }

  // Update theme-constants.ts
  const constantsUpdated = addThemeToConstants(themeId, themeConstantName);
  if (constantsUpdated) {
    console.log(`  ${GREEN}✓${RESET} Updated src/constants/theme-constants.ts`);
  }

  // Success
  console.log(
    `\n${GREEN}${BOLD}  ✅ Theme "${merchantName}" created successfully!${RESET}\n`
  );
  console.log(`  ${BOLD}Theme structure:${RESET}`);
  console.log(`    src/themes/${themeId}/`);
  console.log(`    ├── theme-registry.ts`);
  console.log(`    ├── theme.json`);
  console.log(`    ├── templates/`);
  console.log(`    │   ├── home/`);
  console.log(`    │   │   ├── default.ts`);
  console.log(`    │   │   └── constant.ts`);
  console.log(`    │   └── variant-registry.ts`);
  console.log(`    └── locales/`);
  console.log(`        ├── common/${defaultLang}.json`);
  console.log(`        └── pages/home/${defaultLang}.json`);
  console.log();
  console.log(`  ${BOLD}Next steps:${RESET}`);
  console.log(
    `    1. Customize templates in ${CYAN}src/themes/${themeId}/templates/${RESET}`
  );
  console.log(
    `    2. Add translations in ${CYAN}src/themes/${themeId}/locales/${RESET}`
  );
  console.log(
    `    3. Create widgets with ${CYAN}bun run cli create:widget${RESET}`
  );
  console.log();
}

function generateThemeRegistry(themeId: string, constantName: string): string {
  return `import { THEMES } from "@/constants/theme-constants";
import { TEMPLATE_TYPES } from "@/core/constants/template";

export const themeRegistry = {
  id: THEMES.${constantName}.id,
  supportedLanguages: ["en"],

  templateStructure: {
    [TEMPLATE_TYPES.HOME]: {
      default: {
        templatePath: "/themes/${themeId}/templates/home/default.ts",
        translationsPath: "/themes/${themeId}/locales/pages/home",
        routeContext: {
          templateName: "home",
          type: "home",
          path: "/",
          params: {},
          query: {},
        },
      },
    },
  },
};
`;
}

function generateHomeTemplate(
  themeId: string,
  constantName: string,
  merchantName: string
): string {
  return `import { REGISTER_WIDGETS } from "@/core/constants/register-widgets";
import { SECTION_LAYOUT_OPTIONS } from "@/lib/page-builder/constants/layout-options";
import { Template } from "@/lib/page-builder/models";
import { SECTION_TYPES } from "@/ui/layout/constants";
import { HEADER_SETTINGS, FOOTER_SETTINGS } from "./constant";
import { THEMES } from "@/constants/theme-constants";

export const template: Template = {
  id: "${themeId}-home-page",
  dataSources: {
    // Add your data sources here
    // Example:
    // featuredProducts: {
    //   type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
    //   params: { handle: "featured", limit: 8 },
    //   required: true,
    // },
  },
  sections: [
    // Header Section
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "${themeId}-header",
          name: "${merchantName} Header",
          type: REGISTER_WIDGETS.HeaderNavigation,
          settings: HEADER_SETTINGS,
        },
      ],
    },

    // Hero Section - Add your hero widget here
    {
      id: "hero-section",
      name: "Hero",
      type: SECTION_TYPES.HERO_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        // Add hero widget here
      ],
    },

    // Content Sections - Add your content widgets here
    // Example:
    // {
    //   id: "featured-products-section",
    //   name: "Featured Products",
    //   type: SECTION_TYPES.CONTENT_SECTION,
    //   settings: { ... },
    //   widgets: [ ... ],
    // },

    // Footer Section
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "${themeId}-footer",
          name: "${merchantName} Footer",
          type: REGISTER_WIDGETS.Footer,
          settings: FOOTER_SETTINGS,
        },
      ],
    },
  ],
};
`;
}

function generateTemplateConstants(merchantName: string): string {
  return `/**
 * Template Constants for ${merchantName}
 *
 * Shared settings used across templates.
 */

export const HEADER_SETTINGS = {
  variant: "v1",
  logo: "t:common.logo",
  logoAlt: "${merchantName}",
  menuItems: "t:common.navigation.menuItems",
  showSearch: true,
  showCart: true,
  showAccount: false,
};

export const FOOTER_SETTINGS = {
  variant: "v1",
  logo: "t:common.logo",
  logoAlt: "${merchantName}",
  copyrightText: "t:common.footer.copyright",
  socialLinks: "t:common.footer.socialLinks",
  footerLinks: "t:common.footer.links",
};
`;
}

function generateVariantRegistry(constantName: string): string {
  return `/**
 * Variant Registry for ${constantName} Theme
 *
 * Maps template types to their available variants.
 */

import { TEMPLATE_TYPES } from "@/core/constants/template";

export const variantRegistry = {
  [TEMPLATE_TYPES.HOME]: {
    default: () => import("./home/default").then((m) => m.template),
  },
  // Add more template variants as needed
  // [TEMPLATE_TYPES.PRODUCT]: {
  //   default: () => import("./products/default").then((m) => m.template),
  // },
};
`;
}

function generateCommonLocale(merchantName: string): string {
  return JSON.stringify(
    {
      common: {
        logo: `/images/${toKebabCase(merchantName)}/logo.svg`,
        navigation: {
          menuItems: [
            { label: "Home", href: "/" },
            { label: "Products", href: "/collections/all" },
            { label: "About", href: "/pages/about" },
            { label: "Contact", href: "/pages/contact" },
          ],
        },
        footer: {
          copyright: `© ${new Date().getFullYear()} ${merchantName}. All rights reserved.`,
          socialLinks: [
            { platform: "instagram", url: "#", icon: "instagram" },
            { platform: "facebook", url: "#", icon: "facebook" },
            { platform: "twitter", url: "#", icon: "twitter" },
          ],
          links: [
            {
              title: "Shop",
              items: [
                { label: "All Products", href: "/collections/all" },
                { label: "New Arrivals", href: "/collections/new-arrivals" },
                { label: "Best Sellers", href: "/collections/best-sellers" },
              ],
            },
            {
              title: "Support",
              items: [
                { label: "Contact Us", href: "/pages/contact" },
                { label: "FAQs", href: "/pages/faqs" },
                { label: "Shipping", href: "/pages/shipping" },
              ],
            },
            {
              title: "Legal",
              items: [
                { label: "Privacy Policy", href: "/pages/privacy" },
                { label: "Terms of Service", href: "/pages/terms" },
                { label: "Refund Policy", href: "/pages/refunds" },
              ],
            },
          ],
        },
        addToCartButtonText: "Add to Cart",
        goToCartText: "Go to Cart",
      },
    },
    null,
    2
  );
}

function generateHomeLocale(merchantName: string): string {
  return JSON.stringify(
    {
      home: {
        hero: {
          title: `Welcome to ${merchantName}`,
          subtitle: "Discover our amazing products",
          carousel: {
            items: [
              {
                id: 1,
                desktopImage: "/images/hero-1.webp",
                mobileImage: "/images/hero-1-mobile.webp",
                href: "/collections/all",
                alt: "Hero Banner 1",
              },
            ],
          },
        },
        sections: {
          featured: {
            title: "Featured Products",
            viewAllLink: "/collections/featured",
            viewAllButtonText: "View All",
          },
        },
      },
    },
    null,
    2
  );
}

function addThemeToConstants(themeId: string, constantName: string): boolean {
  if (!existsSync(THEME_CONSTANTS_PATH)) {
    console.log(`  ${YELLOW}Warning: theme-constants.ts not found${RESET}`);
    return false;
  }

  let content = readFileSync(THEME_CONSTANTS_PATH, "utf-8");

  // Check if already exists
  if (content.includes(`${constantName}:`)) {
    return false;
  }

  // Find the closing of THEMES object
  const closingIndex = content.lastIndexOf("} as const;");
  if (closingIndex === -1) {
    return false;
  }

  // Add new theme entry
  const newTheme = `  ${constantName}: {
    id: "${themeId}",
    widgets: {
      // Add theme-specific widget mappings here
    } as const,
  },
`;

  content =
    content.slice(0, closingIndex) + newTheme + content.slice(closingIndex);
  writeFileSync(THEME_CONSTANTS_PATH, content, "utf-8");
  return true;
}

// ─────────────────────────────────────────────
// Widget Creation (reuse existing logic)
// ─────────────────────────────────────────────

async function createWidget() {
  // Import and run the existing create-widget script logic
  const { execSync } = await import("child_process");
  execSync("bun .perf/create-widget.ts", { stdio: "inherit" });
}

// ─────────────────────────────────────────────
// Add Widget to Template
// ─────────────────────────────────────────────

async function addWidgetToTemplate() {
  console.log(
    `\n${BOLD}  📦 Add Widget to Template${RESET}\n  ${"─".repeat(40)}\n`
  );

  // Select theme
  const themes = getExistingThemes();
  if (themes.length === 0) {
    console.log(`  ${RED}No themes found. Create a theme first.${RESET}\n`);
    process.exit(1);
  }
  const selectedTheme = await promptSelect("Select theme:", themes);

  // Select template
  const templates = getTemplatesForTheme(selectedTheme);
  if (templates.length === 0) {
    console.log(
      `  ${RED}No templates found in theme "${selectedTheme}".${RESET}\n`
    );
    process.exit(1);
  }
  const selectedTemplate = await promptSelect("Select template:", templates);

  // Select widget
  const widgets = getExistingWidgets();
  if (widgets.length === 0) {
    console.log(`  ${RED}No widgets found. Create a widget first.${RESET}\n`);
    process.exit(1);
  }
  const selectedWidget = await promptSelect("Select widget to add:", widgets);

  // Get section name
  const sectionName = await prompt(
    "  Section name (e.g., Featured Products): "
  );
  const sectionId = toKebabCase(sectionName || selectedWidget) + "-section";

  // Read template file
  const templatePath = join(
    THEMES_DIR,
    selectedTheme,
    "templates",
    selectedTemplate,
    "default.ts"
  );
  if (!existsSync(templatePath)) {
    console.log(`  ${RED}Template file not found: ${templatePath}${RESET}\n`);
    process.exit(1);
  }

  let content = readFileSync(templatePath, "utf-8");

  // Generate new section
  const newSection = `
    // ${sectionName || selectedWidget} Section
    {
      id: "${sectionId}",
      name: "${sectionName || selectedWidget}",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 16, bottom: 20, left: 16 } },
          tablet: { padding: { top: 24, right: 24, bottom: 24, left: 24 } },
          desktop: { padding: { top: 32, right: 32, bottom: 32, left: 32 } },
        },
      },
      widgets: [
        {
          id: "${selectedTheme}-${toKebabCase(selectedWidget)}",
          name: "${sectionName || selectedWidget}",
          type: REGISTER_WIDGETS.${selectedWidget},
          settings: {
            variant: "v1",
          },
        },
      ],
    },`;

  // Find the footer section and insert before it
  const footerSectionIndex = content.indexOf("// Footer Section");
  if (footerSectionIndex !== -1) {
    content =
      content.slice(0, footerSectionIndex) +
      newSection +
      "\n\n    " +
      content.slice(footerSectionIndex);
  } else {
    // If no footer section, add before closing brackets
    const sectionsEndIndex = content.lastIndexOf("],");
    if (sectionsEndIndex !== -1) {
      content =
        content.slice(0, sectionsEndIndex) +
        newSection +
        "\n  " +
        content.slice(sectionsEndIndex);
    }
  }

  writeFileSync(templatePath, content, "utf-8");

  console.log(`\n${GREEN}${BOLD}  ✅ Widget added to template!${RESET}\n`);
  console.log(
    `  ${GREEN}✓${RESET} Added ${CYAN}${selectedWidget}${RESET} to ${CYAN}${selectedTemplate}${RESET} template`
  );
  console.log(`  ${DIM}File: ${templatePath.replace(ROOT + "/", "")}${RESET}`);
  console.log();
  console.log(`  ${BOLD}Next steps:${RESET}`);
  console.log(`    1. Customize widget settings in the template`);
  console.log(`    2. Add translations if using "t:..." strings`);
  console.log(`    3. Test with ${CYAN}bun run dev${RESET}`);
  console.log();
}

// ─────────────────────────────────────────────
// Main Menu
// ─────────────────────────────────────────────

async function showMainMenu() {
  console.clear();
  console.log(`
${BOLD}  ╔════════════════════════════════════════════════════════════╗
  ║              🚀 Agency Developer CLI                       ║
  ╚════════════════════════════════════════════════════════════╝${RESET}
  `);

  const options = [
    "Create Theme       - Set up a new merchant theme",
    "Create Widget      - Scaffold a new widget with auto-registration",
    "Add Widget to Template - Inject a widget into a theme template",
    "Exit",
  ];

  const choice = await promptSelect("What would you like to do?", options);

  switch (choice) {
    case options[0]:
      await createTheme();
      break;
    case options[1]:
      await createWidget();
      break;
    case options[2]:
      await addWidgetToTemplate();
      break;
    case options[3]:
      console.log(`\n  ${DIM}Goodbye!${RESET}\n`);
      process.exit(0);
  }
}

// ─────────────────────────────────────────────
// CLI Entry Point
// ─────────────────────────────────────────────

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "create:theme":
      await createTheme();
      break;
    case "create:widget":
      await createWidget();
      break;
    case "add:widget":
      await addWidgetToTemplate();
      break;
    default:
      await showMainMenu();
  }
}

main().catch((err) => {
  console.error(`${RED}Error:${RESET}`, err.message);
  process.exit(1);
});
