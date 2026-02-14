/**
 * Widget Performance Scoring Script
 *
 * Parses ESLint output and generates a performance score (0-100) for
 * widgets. Scores are based on which performance rules are violated
 * and their CWV impact.
 *
 * Usage:
 *   bun .perf/score-widget.ts                     # Score ALL widgets
 *   bun .perf/score-widget.ts --staged-only       # Score only staged widgets (pre-commit)
 *   bun .perf/score-widget.ts --files="file1 file2"  # Score specific files (CI)
 *   bun .perf/score-widget.ts --widget=HeroSection  # Score a specific widget
 *   bun .perf/score-widget.ts --min-score=80      # Set minimum passing score (default: 75)
 *
 * Exit code 0 = all widgets pass, 1 = score below threshold
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const MIN_SCORE = parseInt(
  process.argv.find((a) => a.startsWith("--min-score="))?.split("=")[1] || "75"
);
const STAGED_ONLY = process.argv.includes("--staged-only");
const FILES_ARG =
  process.argv.find((a) => a.startsWith("--files="))?.split("=")[1] || "";
const SPECIFIC_WIDGET = process.argv
  .find((a) => a.startsWith("--widget="))
  ?.split("=")[1];
const WIDGETS_DIR = join(process.cwd(), "src/widgets");

// ── Score deduction rules ──
// Each category maps to a CWV metric with weighted deductions

interface DeductionRule {
  pattern: RegExp;
  category: string;
  severity: "error" | "warning";
  points: number;
  fix: string;
}

const DEDUCTION_RULES: DeductionRule[] = [
  // LCP Protection — highest impact on perceived load speed
  {
    pattern: /\[LCP\]/i,
    category: "LCP Protection",
    severity: "error",
    points: 15,
    fix: "Use next/image, next/link, Tailwind classes. Avoid external stylesheets, document.write, window.location.",
  },
  {
    pattern: /no-img-element/i,
    category: "LCP Protection",
    severity: "error",
    points: 15,
    fix: "Replace <img> with next/image: import Image from 'next/image'; <Image src={url} alt={alt} width={w} height={h} />",
  },
  {
    pattern: /no-sync-scripts/i,
    category: "LCP Protection",
    severity: "error",
    points: 15,
    fix: "Remove <script> tags. Use an approved npm package, or next/script with strategy='lazyOnload'.",
  },

  // CLS Protection — visual stability
  {
    pattern: /\[CLS\]/i,
    category: "CLS Protection",
    severity: "error",
    points: 12,
    fix: "Set explicit width/height or aspectRatio on media elements. Avoid dangerouslySetInnerHTML.",
  },
  {
    pattern: /dangerouslySetInnerHTML/i,
    category: "CLS Protection",
    severity: "error",
    points: 12,
    fix: "Replace dangerouslySetInnerHTML with React components. Parse HTML on the server and pass structured data via dataSources.",
  },

  // INP Protection — interaction responsiveness
  {
    pattern: /\[INP\]/i,
    category: "INP Protection",
    severity: "error",
    points: 10,
    fix: "Use named imports instead of import *. Use native JS instead of heavy libraries (lodash, moment, etc.).",
  },
  {
    pattern: /ImportNamespaceSpecifier|import \*/i,
    category: "INP Protection",
    severity: "error",
    points: 10,
    fix: "Change 'import * as X' to 'import { specificExport } from package'. This enables tree-shaking.",
  },

  // Image Optimization
  {
    pattern: /\[IMAGE\]/i,
    category: "Image Optimization",
    severity: "error",
    points: 10,
    fix: "Use next/image for all images. Replace inline base64 images >4KB with CDN URLs.",
  },

  // Video Optimization
  {
    pattern: /\[VIDEO\]/i,
    category: "Video Optimization",
    severity: "warning",
    points: 3,
    fix: "Add muted, poster, and width/height attributes to <video> elements.",
  },

  // Font Optimization
  {
    pattern: /\[FONT\]/i,
    category: "Font Optimization",
    severity: "error",
    points: 8,
    fix: "Use next/font instead of external font CDN URLs. Use @radix-ui/react-icons instead of icon fonts.",
  },

  // CSS Performance
  {
    pattern: /\[CSS\]/i,
    category: "CSS Performance",
    severity: "error",
    points: 8,
    fix: "Use Tailwind utility classes. Remove CSS-in-JS libraries (styled-components, emotion).",
  },

  // JS/Bundle
  {
    pattern: /\[BUNDLE\]/i,
    category: "JS/Bundle",
    severity: "error",
    points: 12,
    fix: "Widgets receive data via the 'data' prop from dataSources. Don't use fetch(), require(), or blocked packages.",
  },
  {
    pattern: /fetch\(\) is not allowed/i,
    category: "JS/Bundle",
    severity: "error",
    points: 12,
    fix: "Add a dataSource to your template's dataSources config. Widget receives data through the 'data' prop.",
  },
  {
    pattern: /require\(\)/i,
    category: "JS/Bundle",
    severity: "error",
    points: 12,
    fix: "Replace require() with ES import: import { fn } from 'package';",
  },

  // Third-Party Scripts — high risk
  {
    pattern: /\[THIRD-PARTY\]/i,
    category: "Third-Party Scripts",
    severity: "error",
    points: 15,
    fix: "Remove <script> tags and document.createElement('script'). Use an approved npm package instead.",
  },

  // Static Generation — highest impact
  {
    pattern: /\[STATIC\]|STATIC PAGE VIOLATION/i,
    category: "Static Generation",
    severity: "error",
    points: 20,
    fix: "Pages must be static. Remove cookies(), headers(), noStore(), force-dynamic. Add revalidate and generateStaticParams.",
  },

  // Memory Leaks
  {
    pattern: /MEMORY LEAK/i,
    category: "Memory Leaks",
    severity: "warning",
    points: 3,
    fix: "Add cleanup in useEffect return: clearInterval, removeEventListener, observer.disconnect(), etc.",
  },

  // Structure/Contract
  {
    pattern: /\[STRUCTURE\]/i,
    category: "Widget Structure",
    severity: "error",
    points: 20,
    fix: "Run 'bun run create:widget' to scaffold a correct widget structure, or see docs/PERFORMANCE_RULES.md.",
  },
];

// ── Categories for display ──
const ALL_CATEGORIES = [
  "LCP Protection",
  "CLS Protection",
  "INP Protection",
  "Image Optimization",
  "Video Optimization",
  "Font Optimization",
  "CSS Performance",
  "JS/Bundle",
  "Third-Party Scripts",
  "Static Generation",
  "Memory Leaks",
  "Widget Structure",
];

interface LintMessage {
  filePath: string;
  messages: Array<{
    ruleId: string | null;
    severity: number; // 1 = warn, 2 = error
    message: string;
    line: number;
    column: number;
  }>;
}

interface ScoreEntry {
  category: string;
  message: string;
  points: number;
  line: number;
  file: string;
  fix: string;
}

interface WidgetScore {
  name: string;
  score: number;
  errors: ScoreEntry[];
  warnings: ScoreEntry[];
  categoryDeductions: Map<string, number>;
}

// ── Get widget name from file path ──
function getWidgetName(filePath: string): string | null {
  // Match src/widgets/{scope}/{WidgetName}/...
  const match = filePath.match(/src\/widgets\/[^/]+\/([^/]+)\//);
  return match ? match[1] : null;
}

// ── Classify a lint message ──
function classifyMessage(
  message: string,
  ruleId: string | null,
  severity: number
): { category: string; points: number; fix: string } | null {
  const fullText = `${message} ${ruleId || ""}`;

  for (const rule of DEDUCTION_RULES) {
    if (rule.pattern.test(fullText)) {
      // Adjust points based on actual severity (warnings get fewer points)
      const points =
        severity === 1 ? Math.ceil(rule.points * 0.3) : rule.points;
      return { category: rule.category, points, fix: rule.fix };
    }
  }

  // Default: unclassified errors still deduct
  if (severity === 2) {
    return {
      category: "Other",
      points: 5,
      fix: "See docs/PERFORMANCE_RULES.md for guidance.",
    };
  }
  return null; // Unclassified warnings don't deduct
}

// ── Build progress bar ──
function progressBar(score: number, width: number = 10): string {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty);
}

// ── Grade ──
function grade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 50) return "C";
  return "F";
}

// ── Run ESLint and parse output ──
function runESLint(): LintMessage[] {
  try {
    // Run ESLint on widget files with JSON formatter
    const output = execSync(
      `npx next lint --dir src/widgets src/themes --format json --quiet 2>/dev/null || true`,
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    );

    // Try to parse JSON output
    try {
      return JSON.parse(output);
    } catch {
      // next lint might not support --format json, fall back to text parsing
      return parseTextOutput(output);
    }
  } catch {
    return [];
  }
}

// ── Parse text ESLint output ──
function parseTextOutput(output: string): LintMessage[] {
  const messages: LintMessage[] = [];
  let currentFile: LintMessage | null = null;

  for (const line of output.split("\n")) {
    // File path line (starts with /)
    if (line.match(/^\//) || line.match(/^src\//)) {
      const filePath = line.trim();
      currentFile = { filePath, messages: [] };
      messages.push(currentFile);
      continue;
    }

    // Error/warning line (starts with line:col)
    const match = line.match(
      /^\s*(\d+):(\d+)\s+(error|warning)\s+(.+?)(?:\s+(\S+))?\s*$/
    );
    if (match && currentFile) {
      currentFile.messages.push({
        line: parseInt(match[1]),
        column: parseInt(match[2]),
        severity: match[3] === "error" ? 2 : 1,
        message: match[4].trim(),
        ruleId: match[5] || null,
      });
    }
  }

  return messages;
}

// ── Scan for additional patterns not caught by ESLint ──
function scanWidgetFile(filePath: string): Array<{
  message: string;
  line: number;
  category: string;
  severity: "error" | "warning";
  points: number;
}> {
  const issues: Array<{
    message: string;
    line: number;
    category: string;
    severity: "error" | "warning";
    points: number;
  }> = [];

  if (!existsSync(filePath)) return issues;
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // L6: CSS background-image (warning)
    if (line.includes("backgroundImage") && line.includes("url(")) {
      issues.push({
        message:
          "[LCP] CSS background-image cannot be preloaded. Use next/image for hero/banner visuals.",
        line: lineNum,
        category: "LCP Protection",
        severity: "warning",
        points: 5,
      });
    }

    // V2: Video autoplay without muted
    if (line.includes("autoPlay") && !line.includes("muted")) {
      issues.push({
        message:
          "[VIDEO] autoplay without muted is blocked by browsers. Add muted attribute.",
        line: lineNum,
        category: "Video Optimization",
        severity: "warning",
        points: 3,
      });
    }

    // V3: Video without poster
    if (line.match(/<video/i) && !line.includes("poster")) {
      issues.push({
        message:
          "[VIDEO] <video> without poster shows a black rectangle until loaded.",
        line: lineNum,
        category: "Video Optimization",
        severity: "warning",
        points: 3,
      });
    }

    // F2: External font CDN URLs
    if (
      line.includes("fonts.googleapis.com") ||
      line.includes("use.typekit.net") ||
      line.includes("fonts.cdnfonts.com")
    ) {
      issues.push({
        message:
          "[FONT] External font URL detected. Use next/font instead — it self-hosts fonts at build time.",
        line: lineNum,
        category: "Font Optimization",
        severity: "error",
        points: 8,
      });
    }

    // IM2: Large inline base64 images
    if (line.includes("data:image") && line.length > 5400) {
      issues.push({
        message:
          "[IMAGE] Inline base64 image >4KB. Use a URL with next/image instead.",
        line: lineNum,
        category: "Image Optimization",
        severity: "error",
        points: 10,
      });
    }

    // C6: CSS animations on layout properties
    const layoutAnimMatch = line.match(
      /transition\s*:.*?\b(top|left|right|bottom|width|height|margin|padding)\b/
    );
    if (layoutAnimMatch) {
      issues.push({
        message: `[CLS] Animating '${layoutAnimMatch[1]}' triggers layout recalculation. Use CSS transform instead.`,
        line: lineNum,
        category: "CLS Protection",
        severity: "warning",
        points: 4,
      });
    }

    // C9: GIF usage
    if (line.match(/['"]\S+\.gif['"]/)) {
      issues.push({
        message:
          "[CLS] GIF files are 5-20x larger than video. Use <video autoPlay muted loop> with MP4/WebM.",
        line: lineNum,
        category: "CLS Protection",
        severity: "warning",
        points: 4,
      });
    }
  });

  return issues;
}

// ── Find changed widget files for scanning ──
function getChangedWidgetFiles(): string[] {
  let files: string[] = [];

  // If --files is provided (CI mode), use those files
  if (FILES_ARG) {
    files = FILES_ARG.split(/\s+/).filter(Boolean);
  } else {
    // Otherwise use git staged files (local pre-commit)
    try {
      const output = execSync("git diff --cached --name-only", {
        encoding: "utf-8",
      });
      files = output.split("\n").filter(Boolean);
    } catch {
      return [];
    }
  }

  return files
    .filter(
      (f) =>
        f.startsWith("src/widgets/") &&
        (f.endsWith(".tsx") || f.endsWith(".ts"))
    )
    .map((f) => join(process.cwd(), f));
}

// ── ANSI colors ──
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

// ── Get staged widget names for filtering ──
function getStagedWidgetNames(): Set<string> {
  const names = new Set<string>();
  let files: string[] = [];

  // If --files is provided (CI mode), use those files
  if (FILES_ARG) {
    files = FILES_ARG.split(/\s+/).filter(Boolean);
  } else {
    // Otherwise use git staged files (local pre-commit)
    try {
      const output = execSync("git diff --cached --name-only", {
        encoding: "utf-8",
      });
      files = output.split("\n").filter(Boolean);
    } catch {
      return new Set();
    }
  }

  for (const f of files) {
    if (f.startsWith("src/widgets/")) {
      const match = f.match(/^src\/widgets\/[^/]+\/([^/]+)\//);
      if (match) names.add(match[1]);
    }
  }
  return names;
}

// ── Get all widget names from the widgets directory ──
function getAllWidgetNames(): Set<string> {
  const names = new Set<string>();
  if (!existsSync(WIDGETS_DIR)) return names;

  // Iterate through scope directories (common/, wellversed/, etc.)
  for (const scope of readdirSync(WIDGETS_DIR)) {
    const scopePath = join(WIDGETS_DIR, scope);
    if (!statSync(scopePath).isDirectory()) continue;
    if (scope.startsWith(".") || scope === "types.ts") continue;

    // Iterate through widget directories
    for (const widget of readdirSync(scopePath)) {
      const widgetPath = join(scopePath, widget);
      if (!statSync(widgetPath).isDirectory()) continue;
      names.add(widget);
    }
  }
  return names;
}

// ── Get all widget files for a specific widget ──
function getWidgetFiles(widgetName: string): string[] {
  const files: string[] = [];
  if (!existsSync(WIDGETS_DIR)) return files;

  // Search in all scopes
  for (const scope of readdirSync(WIDGETS_DIR)) {
    const scopePath = join(WIDGETS_DIR, scope);
    if (!statSync(scopePath).isDirectory()) continue;

    const widgetPath = join(scopePath, widgetName);
    if (!existsSync(widgetPath)) continue;

    // Recursively find all .ts/.tsx files in the widget directory
    function walkDir(dir: string) {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          walkDir(full);
        } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
          files.push(full);
        }
      }
    }
    walkDir(widgetPath);
  }
  return files;
}

// ── Get all widget files for all widgets ──
function getAllWidgetFiles(): string[] {
  const files: string[] = [];
  if (!existsSync(WIDGETS_DIR)) return files;

  function walkDir(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walkDir(full);
      } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
        files.push(full);
      }
    }
  }
  walkDir(WIDGETS_DIR);
  return files;
}

// ── Main ──

// Determine which widgets to score based on mode
let targetWidgetNames: Set<string>;
let filesToScan: string[];

if (SPECIFIC_WIDGET) {
  // Mode: Score a specific widget
  const allWidgets = getAllWidgetNames();
  if (!allWidgets.has(SPECIFIC_WIDGET)) {
    console.log(`${RED}Error: Widget "${SPECIFIC_WIDGET}" not found.${RESET}`);
    console.log(`Available widgets: ${[...allWidgets].sort().join(", ")}`);
    process.exit(1);
  }
  targetWidgetNames = new Set([SPECIFIC_WIDGET]);
  filesToScan = getWidgetFiles(SPECIFIC_WIDGET);
  console.log(`\n${BOLD}Performance Score: ${SPECIFIC_WIDGET}${RESET}`);
} else if (STAGED_ONLY || FILES_ARG) {
  // Mode: Score only staged/specified widgets (pre-commit or CI)
  const stagedNames = getStagedWidgetNames();
  if (stagedNames.size === 0) {
    console.log("No widget files staged. Skipping performance scoring.");
    process.exit(0);
  }
  targetWidgetNames = stagedNames;
  filesToScan = getChangedWidgetFiles();
  console.log(`\n${BOLD}Performance Score Report (Changed Only)${RESET}`);
} else {
  // Mode: Score ALL widgets
  targetWidgetNames = getAllWidgetNames();
  filesToScan = getAllWidgetFiles();
  console.log(`\n${BOLD}Performance Score Report (All Widgets)${RESET}`);
}

console.log("=".repeat(50) + "\n");

// Get ESLint results
const lintResults = runESLint();

// Group by widget
const widgetScores = new Map<string, WidgetScore>();

// Process ESLint results
for (const result of lintResults) {
  const widgetName = getWidgetName(result.filePath);
  if (!widgetName) continue;

  if (!widgetScores.has(widgetName)) {
    widgetScores.set(widgetName, {
      name: widgetName,
      score: 100,
      errors: [],
      warnings: [],
      categoryDeductions: new Map(),
    });
  }

  const ws = widgetScores.get(widgetName)!;

  for (const msg of result.messages) {
    const classification = classifyMessage(
      msg.message,
      msg.ruleId,
      msg.severity
    );
    if (!classification) continue;

    const entry: ScoreEntry = {
      category: classification.category,
      message: msg.message,
      points: classification.points,
      line: msg.line,
      file: relative(process.cwd(), result.filePath),
      fix: classification.fix,
    };

    if (msg.severity === 2) {
      ws.errors.push(entry);
    } else {
      ws.warnings.push(entry);
    }

    ws.score = Math.max(0, ws.score - classification.points);
    ws.categoryDeductions.set(
      classification.category,
      (ws.categoryDeductions.get(classification.category) || 0) +
        classification.points
    );
  }
}

// Process additional file scanning
for (const filePath of filesToScan) {
  const widgetName = getWidgetName(relative(process.cwd(), filePath));
  if (!widgetName) continue;

  if (!widgetScores.has(widgetName)) {
    widgetScores.set(widgetName, {
      name: widgetName,
      score: 100,
      errors: [],
      warnings: [],
      categoryDeductions: new Map(),
    });
  }

  const ws = widgetScores.get(widgetName)!;
  const additionalIssues = scanWidgetFile(filePath);

  for (const issue of additionalIssues) {
    // Find matching deduction rule for fix hint
    let fix = "See docs/PERFORMANCE_RULES.md for guidance.";
    for (const rule of DEDUCTION_RULES) {
      if (rule.pattern.test(issue.message)) {
        fix = rule.fix;
        break;
      }
    }

    const entry: ScoreEntry = {
      category: issue.category,
      message: issue.message,
      points: issue.points,
      line: issue.line,
      file: relative(process.cwd(), filePath),
      fix,
    };

    if (issue.severity === "error") {
      ws.errors.push(entry);
    } else {
      ws.warnings.push(entry);
    }

    ws.score = Math.max(0, ws.score - issue.points);
    ws.categoryDeductions.set(
      issue.category,
      (ws.categoryDeductions.get(issue.category) || 0) + issue.points
    );
  }
}

// ── Filter to target widgets based on mode ──
for (const name of [...widgetScores.keys()]) {
  if (!targetWidgetNames.has(name)) {
    widgetScores.delete(name);
  }
}

// Ensure all target widgets have an entry (even if score is 100)
for (const name of targetWidgetNames) {
  if (!widgetScores.has(name)) {
    widgetScores.set(name, {
      name,
      score: 100,
      errors: [],
      warnings: [],
      categoryDeductions: new Map(),
    });
  }
}

// ── Output Report ──

if (widgetScores.size === 0) {
  console.log("No widgets to score.\n");
  process.exit(0);
}

let hasFailure = false;

for (const [name, ws] of widgetScores) {
  const g = grade(ws.score);
  const passed = ws.score >= MIN_SCORE;
  const statusColor = passed ? GREEN : RED;
  const status = passed ? "PASSED" : "BLOCKED";

  if (!passed) hasFailure = true;

  console.log(
    `${BOLD}Widget: ${name.padEnd(30)}${RESET} Score: ${statusColor}${ws.score}/100 [${g}] ${status}${RESET}`
  );
  console.log();

  // Category breakdown
  for (const cat of ALL_CATEGORIES) {
    const deduction = ws.categoryDeductions.get(cat) || 0;
    const deductColor = deduction > 0 ? RED : DIM;
    console.log(
      `  ${cat.padEnd(22)} ${progressBar(Math.max(0, 100 - deduction))}  ${deductColor}${deduction > 0 ? `-${deduction}` : " 0 "}${RESET}`
    );
  }
  console.log();

  // Errors with fix hints
  if (ws.errors.length > 0) {
    console.log(`  ${RED}Errors (must fix):${RESET}`);
    for (const err of ws.errors) {
      const tag = err.category
        .replace("Protection", "")
        .replace("Optimization", "")
        .trim()
        .toUpperCase();
      console.log(
        `    ${RED}Line ${String(err.line).padEnd(4)}${RESET} [${tag}] ${err.message.substring(0, 120)}`
      );
      console.log(`           ${DIM}${err.file}${RESET}`);
      console.log(`           ${CYAN}Fix: ${err.fix}${RESET}`);
    }
    console.log();
  }

  // Warnings with fix hints
  if (ws.warnings.length > 0) {
    console.log(`  ${YELLOW}Warnings (should fix):${RESET}`);
    for (const warn of ws.warnings) {
      const tag = warn.category
        .replace("Protection", "")
        .replace("Optimization", "")
        .trim()
        .toUpperCase();
      console.log(
        `    ${YELLOW}Line ${String(warn.line).padEnd(4)}${RESET} [${tag}] ${warn.message.substring(0, 120)}`
      );
      console.log(`           ${CYAN}Fix: ${warn.fix}${RESET}`);
    }
    console.log();
  }

  // Top 3 highest-impact fixes
  const allIssues = [...ws.errors, ...ws.warnings].sort(
    (a, b) => b.points - a.points
  );
  const uniqueFixes = new Map<string, number>();
  for (const issue of allIssues) {
    if (!uniqueFixes.has(issue.fix)) {
      uniqueFixes.set(issue.fix, issue.points);
    }
  }
  const topFixes = [...uniqueFixes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (topFixes.length > 0) {
    console.log(`  ${BOLD}Top fixes to improve score:${RESET}`);
    topFixes.forEach(([fix, pts], i) => {
      console.log(
        `    ${i + 1}. ${CYAN}${fix}${RESET} ${DIM}(+${pts} pts)${RESET}`
      );
    });
    console.log();
  }

  console.log("-".repeat(50));
  console.log();
}

// Summary
const total = widgetScores.size;
const passing = [...widgetScores.values()].filter(
  (w) => w.score >= MIN_SCORE
).length;
const failing = total - passing;

const summaryColor = failing > 0 ? RED : GREEN;
console.log(
  `${BOLD}Summary:${RESET} ${summaryColor}${passing}/${total} widgets passed${RESET} (minimum: ${MIN_SCORE}/100)`
);

if (hasFailure) {
  console.log(
    `\n${RED}${failing} widget(s) below minimum score. Fix errors and retry.${RESET}`
  );
  console.log(
    `${DIM}See docs/PERFORMANCE_RULES.md for full rule reference with code examples.${RESET}\n`
  );
  process.exit(1);
} else {
  console.log(`\n${GREEN}All widgets meet performance standards.${RESET}\n`);
  process.exit(0);
}
