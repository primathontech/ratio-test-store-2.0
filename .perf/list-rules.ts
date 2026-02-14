/**
 * Performance Rules CLI Viewer
 *
 * Displays all performance rules in a formatted terminal table.
 * Agency developers can quickly see what rules exist and their impact.
 *
 * Usage:
 *   bun .perf/list-rules.ts                  # Show all rules
 *   bun .perf/list-rules.ts --category=LCP   # Filter by category
 *   bun .perf/list-rules.ts --blocked        # Show blocked packages only
 *   bun .perf/list-rules.ts --allowed        # Show allowed packages only
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

// ── Parse args ──
const CATEGORY_FILTER = process.argv
  .find((a) => a.startsWith("--category="))
  ?.split("=")[1]
  ?.toUpperCase();
const SHOW_BLOCKED = process.argv.includes("--blocked");
const SHOW_ALLOWED = process.argv.includes("--allowed");

// ── Rule definitions ──
// Extracted from .eslintrc.json and score-widget.ts

interface Rule {
  id: string;
  severity: "ERROR" | "WARN";
  points: number;
  description: string;
  category: string;
}

const RULES: Rule[] = [
  // LCP
  {
    id: "L1",
    severity: "ERROR",
    points: 15,
    description: "Use next/image instead of <img>",
    category: "LCP",
  },
  {
    id: "L3",
    severity: "ERROR",
    points: 15,
    description: "No synchronous <script> tags",
    category: "LCP",
  },
  {
    id: "L4",
    severity: "ERROR",
    points: 15,
    description: "No external stylesheets (<link rel=stylesheet>)",
    category: "LCP",
  },
  {
    id: "L5",
    severity: "ERROR",
    points: 15,
    description: "No document.write() or document.writeln()",
    category: "LCP",
  },
  {
    id: "L6",
    severity: "WARN",
    points: 5,
    description: "Avoid CSS backgroundImage with url()",
    category: "LCP",
  },
  {
    id: "L7",
    severity: "ERROR",
    points: 15,
    description: "No window.location / location.href assignment",
    category: "LCP",
  },

  // CLS
  {
    id: "C2",
    severity: "ERROR",
    points: 12,
    description: "<video> must have width/height or aspectRatio",
    category: "CLS",
  },
  {
    id: "C3",
    severity: "ERROR",
    points: 12,
    description: "<iframe> must have width/height attributes",
    category: "CLS",
  },
  {
    id: "C7",
    severity: "ERROR",
    points: 12,
    description: "No dangerouslySetInnerHTML",
    category: "CLS",
  },
  {
    id: "C6",
    severity: "WARN",
    points: 4,
    description:
      "No layout property animations (top/left/width/height/margin/padding)",
    category: "CLS",
  },
  {
    id: "C9",
    severity: "WARN",
    points: 4,
    description: "No GIF files (use <video> with MP4/WebM)",
    category: "CLS",
  },

  // INP
  {
    id: "I1",
    severity: "ERROR",
    points: 10,
    description: "No namespace imports (import *)",
    category: "INP",
  },
  {
    id: "I2",
    severity: "ERROR",
    points: 10,
    description:
      "No heavy libraries (lodash, moment, chart.js, d3, framer-motion, gsap)",
    category: "INP",
  },

  // Image
  {
    id: "IM1",
    severity: "ERROR",
    points: 15,
    description: "Use next/image for all images",
    category: "IMAGE",
  },
  {
    id: "IM2",
    severity: "ERROR",
    points: 10,
    description: "No inline base64 images > 4KB",
    category: "IMAGE",
  },

  // Video
  {
    id: "V1",
    severity: "ERROR",
    points: 12,
    description: "<video> must have dimensions",
    category: "VIDEO",
  },
  {
    id: "V2",
    severity: "WARN",
    points: 3,
    description: "autoPlay requires muted attribute",
    category: "VIDEO",
  },
  {
    id: "V3",
    severity: "WARN",
    points: 3,
    description: "<video> should have poster attribute",
    category: "VIDEO",
  },

  // Font
  {
    id: "F1",
    severity: "ERROR",
    points: 12,
    description:
      "No icon font libraries (font-awesome, material-icons, ionicons)",
    category: "FONT",
  },
  {
    id: "F2",
    severity: "ERROR",
    points: 8,
    description: "No external font CDN URLs (use next/font)",
    category: "FONT",
  },

  // CSS
  {
    id: "CS1",
    severity: "ERROR",
    points: 15,
    description: "No external stylesheets in widgets",
    category: "CSS",
  },
  {
    id: "CS2",
    severity: "ERROR",
    points: 8,
    description: "No CSS-in-JS (styled-components, @emotion)",
    category: "CSS",
  },
  {
    id: "CS3",
    severity: "ERROR",
    points: 8,
    description: "No animate.css (use Tailwind animate)",
    category: "CSS",
  },

  // JS/Bundle
  {
    id: "J1",
    severity: "ERROR",
    points: 12,
    description: "No fetch() in widgets (use dataSources)",
    category: "BUNDLE",
  },
  {
    id: "J2",
    severity: "ERROR",
    points: 12,
    description: "No window.fetch() in widgets",
    category: "BUNDLE",
  },
  {
    id: "J3",
    severity: "ERROR",
    points: 12,
    description: "No require() (use ES imports)",
    category: "BUNDLE",
  },
  {
    id: "J4",
    severity: "ERROR",
    points: 12,
    description: "No blocked packages (axios, jquery, swiper, react-query)",
    category: "BUNDLE",
  },

  // Third-Party
  {
    id: "T1",
    severity: "ERROR",
    points: 15,
    description: "No <script> tags in widget JSX",
    category: "THIRD-PARTY",
  },
  {
    id: "T2",
    severity: "ERROR",
    points: 15,
    description: "No document.createElement('script')",
    category: "THIRD-PARTY",
  },
  {
    id: "T3",
    severity: "ERROR",
    points: 15,
    description: "No document.write() for script injection",
    category: "THIRD-PARTY",
  },

  // Static Generation
  {
    id: "S1",
    severity: "ERROR",
    points: 20,
    description: "No cookies() / headers() / draftMode() in pages",
    category: "STATIC",
  },
  {
    id: "S2",
    severity: "ERROR",
    points: 20,
    description: "No useSearchParams in pages",
    category: "STATIC",
  },
  {
    id: "S3",
    severity: "ERROR",
    points: 20,
    description: "No getLocale() (uses cookies internally)",
    category: "STATIC",
  },
  {
    id: "S4",
    severity: "ERROR",
    points: 20,
    description: "No noStore() / unstable_noStore()",
    category: "STATIC",
  },
  {
    id: "S5",
    severity: "ERROR",
    points: 20,
    description: "Must export revalidate (e.g. = 3600)",
    category: "STATIC",
  },
  {
    id: "S6",
    severity: "ERROR",
    points: 20,
    description: "Dynamic routes must have generateStaticParams",
    category: "STATIC",
  },
  {
    id: "S7",
    severity: "ERROR",
    points: 20,
    description: "No 'use client' in page files",
    category: "STATIC",
  },
  {
    id: "S8",
    severity: "ERROR",
    points: 20,
    description: "Must use createPageBuildingEngine()",
    category: "STATIC",
  },
  {
    id: "S9",
    severity: "ERROR",
    points: 20,
    description: "No export const dynamic = 'force-dynamic'",
    category: "STATIC",
  },
  {
    id: "S10",
    severity: "ERROR",
    points: 20,
    description: "No revalidate = 0",
    category: "STATIC",
  },
  {
    id: "S11",
    severity: "ERROR",
    points: 20,
    description: "No cache: 'no-store'",
    category: "STATIC",
  },

  // Memory
  {
    id: "M1",
    severity: "WARN",
    points: 3,
    description: "setInterval — must clear in useEffect cleanup",
    category: "MEMORY",
  },
  {
    id: "M2",
    severity: "WARN",
    points: 3,
    description: "setTimeout — should clear in useEffect cleanup",
    category: "MEMORY",
  },
  {
    id: "M3",
    severity: "WARN",
    points: 3,
    description: "addEventListener — must remove in useEffect cleanup",
    category: "MEMORY",
  },
  {
    id: "M4",
    severity: "WARN",
    points: 3,
    description: "WebSocket/EventSource — must close in cleanup",
    category: "MEMORY",
  },
  {
    id: "M5",
    severity: "WARN",
    points: 3,
    description: "Observers — must disconnect in cleanup",
    category: "MEMORY",
  },
  {
    id: "M6",
    severity: "WARN",
    points: 3,
    description: ".subscribe() — must unsubscribe in cleanup",
    category: "MEMORY",
  },
];

// ── Load packages ──
const PACKAGES_PATH = join(process.cwd(), ".perf/allowed-packages.json");

function loadPackages(): {
  allowed: string[];
  blocked: Record<string, string>;
} {
  if (!existsSync(PACKAGES_PATH)) return { allowed: [], blocked: {} };
  const content = JSON.parse(readFileSync(PACKAGES_PATH, "utf-8"));
  return {
    allowed: content.allowed || [],
    blocked: content.blocked_with_reason || {},
  };
}

// ── Display ──

function printRules() {
  const filteredRules = CATEGORY_FILTER
    ? RULES.filter((r) => r.category === CATEGORY_FILTER)
    : RULES;

  if (filteredRules.length === 0) {
    const categories = [...new Set(RULES.map((r) => r.category))];
    console.log(`\nNo rules found for category "${CATEGORY_FILTER}".`);
    console.log(`Available: ${categories.join(", ")}\n`);
    return;
  }

  const totalRules = filteredRules.length;
  const errorCount = filteredRules.filter((r) => r.severity === "ERROR").length;
  const warnCount = filteredRules.filter((r) => r.severity === "WARN").length;

  console.log(
    `\n${BOLD}Performance Rules${RESET} (${totalRules} rules: ${RED}${errorCount} errors${RESET}, ${YELLOW}${warnCount} warnings${RESET})`
  );
  console.log("=".repeat(70) + "\n");

  // Group by category
  const grouped = new Map<string, Rule[]>();
  for (const rule of filteredRules) {
    if (!grouped.has(rule.category)) grouped.set(rule.category, []);
    grouped.get(rule.category)!.push(rule);
  }

  for (const [category, rules] of grouped) {
    const categoryLabel = getCategoryLabel(category);
    console.log(
      `${BOLD}[${category}] ${categoryLabel}${RESET} (${rules.length} rules)`
    );

    for (const rule of rules) {
      const sevColor = rule.severity === "ERROR" ? RED : YELLOW;
      const sevLabel = rule.severity.padEnd(5);
      console.log(
        `  ${DIM}${rule.id.padEnd(4)}${RESET} ${sevColor}${sevLabel}${RESET}  ${rule.description.padEnd(55)} ${DIM}-${rule.points} pts${RESET}`
      );
    }
    console.log();
  }
}

function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    LCP: "Largest Contentful Paint",
    CLS: "Cumulative Layout Shift",
    INP: "Interaction to Next Paint",
    IMAGE: "Image Optimization",
    VIDEO: "Video Optimization",
    FONT: "Font Optimization",
    CSS: "CSS Performance",
    BUNDLE: "JS / Bundle Size",
    "THIRD-PARTY": "Third-Party Scripts",
    STATIC: "Static Generation",
    MEMORY: "Memory Leak Prevention",
  };
  return labels[cat] || cat;
}

function printPackages() {
  const { allowed, blocked } = loadPackages();

  if (SHOW_ALLOWED || (!SHOW_BLOCKED && !SHOW_ALLOWED)) {
    console.log(
      `${BOLD}${GREEN}Allowed Packages${RESET} (${allowed.length}):\n`
    );
    const perRow = 4;
    for (let i = 0; i < allowed.length; i += perRow) {
      const row = allowed.slice(i, i + perRow);
      console.log(
        "  " + row.map((p) => `${GREEN}${p.padEnd(28)}${RESET}`).join("")
      );
    }
    console.log();
  }

  if (SHOW_BLOCKED || (!SHOW_BLOCKED && !SHOW_ALLOWED)) {
    const blockedEntries = Object.entries(blocked);
    console.log(
      `${BOLD}${RED}Blocked Packages${RESET} (${blockedEntries.length}):\n`
    );
    for (const [pkg, reason] of blockedEntries) {
      console.log(`  ${RED}${pkg.padEnd(28)}${RESET} ${DIM}${reason}${RESET}`);
    }
    console.log();
  }
}

// ── Main ──
if (SHOW_BLOCKED && !SHOW_ALLOWED) {
  printPackages();
} else if (SHOW_ALLOWED && !SHOW_BLOCKED) {
  printPackages();
} else {
  printRules();
  if (!CATEGORY_FILTER) {
    printPackages();
  }
  console.log(
    `${DIM}For detailed code examples and fix guidance, see docs/PERFORMANCE_RULES.md${RESET}\n`
  );
}
