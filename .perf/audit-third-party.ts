/**
 * Third-Party Script Audit
 *
 * Phase 2: Audits third-party scripts for performance impact
 *
 * This is a WARNING-ONLY check. It doesn't block commits but
 * provides visibility into third-party script usage.
 *
 * What this checks:
 * - Known heavy third-party scripts (analytics, widgets, etc.)
 * - Scripts loaded synchronously (blocking)
 * - Scripts not using next/script
 * - Multiple tracking scripts
 *
 * Usage:
 *   bun .perf/audit-third-party.ts
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname, relative } from "path";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

/**
 * Known third-party scripts and their approximate sizes
 */
const KNOWN_SCRIPTS: Record<
  string,
  { name: string; size: string; category: string }
> = {
  // Analytics
  gtag: {
    name: "Google Analytics (gtag)",
    size: "~45KB",
    category: "analytics",
  },
  "google-analytics": {
    name: "Google Analytics",
    size: "~45KB",
    category: "analytics",
  },
  googletagmanager: {
    name: "Google Tag Manager",
    size: "~80KB",
    category: "analytics",
  },
  "facebook.net/en_US/fbevents": {
    name: "Facebook Pixel",
    size: "~60KB",
    category: "analytics",
  },
  fbevents: { name: "Facebook Pixel", size: "~60KB", category: "analytics" },
  hotjar: { name: "Hotjar", size: "~50KB", category: "analytics" },
  clarity: { name: "Microsoft Clarity", size: "~30KB", category: "analytics" },
  mixpanel: { name: "Mixpanel", size: "~40KB", category: "analytics" },
  segment: { name: "Segment", size: "~35KB", category: "analytics" },
  amplitude: { name: "Amplitude", size: "~35KB", category: "analytics" },
  posthog: { name: "PostHog", size: "~45KB", category: "analytics" },

  // Customer support
  intercom: { name: "Intercom", size: "~200KB", category: "support" },
  crisp: { name: "Crisp", size: "~100KB", category: "support" },
  zendesk: { name: "Zendesk", size: "~150KB", category: "support" },
  freshdesk: { name: "Freshdesk", size: "~100KB", category: "support" },
  tawk: { name: "Tawk.to", size: "~150KB", category: "support" },
  drift: { name: "Drift", size: "~180KB", category: "support" },

  // Reviews & Social proof
  trustpilot: { name: "Trustpilot", size: "~80KB", category: "reviews" },
  loox: { name: "Loox Reviews", size: "~60KB", category: "reviews" },
  yotpo: { name: "Yotpo", size: "~100KB", category: "reviews" },
  stamped: { name: "Stamped.io", size: "~70KB", category: "reviews" },
  judgeme: { name: "Judge.me", size: "~50KB", category: "reviews" },
  okendo: { name: "Okendo", size: "~60KB", category: "reviews" },

  // Marketing
  klaviyo: { name: "Klaviyo", size: "~120KB", category: "marketing" },
  mailchimp: { name: "Mailchimp", size: "~80KB", category: "marketing" },
  privy: { name: "Privy", size: "~90KB", category: "marketing" },
  optinmonster: { name: "OptinMonster", size: "~100KB", category: "marketing" },
  sumo: { name: "Sumo", size: "~80KB", category: "marketing" },

  // Payment
  stripe: { name: "Stripe", size: "~30KB", category: "payment" },
  razorpay: { name: "Razorpay", size: "~40KB", category: "payment" },
  paypal: { name: "PayPal", size: "~50KB", category: "payment" },

  // Other
  recaptcha: { name: "reCAPTCHA", size: "~150KB", category: "security" },
  hcaptcha: { name: "hCaptcha", size: "~50KB", category: "security" },
};

/**
 * Directories to scan
 */
const SCAN_DIRS = ["src/app", "src/components", "src/widgets", "src/lib"];

/**
 * File extensions to check
 */
const FILE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface ScriptDetection {
  script: string;
  name: string;
  size: string;
  category: string;
  file: string;
  line: number;
  isBlocking: boolean;
  usesNextScript: boolean;
}

interface AuditResult {
  detections: ScriptDetection[];
  summary: {
    total: number;
    byCategory: Record<string, number>;
    blocking: number;
    notUsingNextScript: number;
  };
  recommendations: string[];
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getAllFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    if (!existsSync(currentDir)) return;

    try {
      const entries = readdirSync(currentDir);
      for (const entry of entries) {
        const fullPath = join(currentDir, entry);
        try {
          const stat = statSync(fullPath);
          if (stat.isDirectory()) {
            if (
              entry !== "node_modules" &&
              entry !== ".next" &&
              !entry.startsWith(".")
            ) {
              walk(fullPath);
            }
          } else if (FILE_EXTENSIONS.includes(extname(entry).toLowerCase())) {
            files.push(fullPath);
          }
        } catch {
          // Skip files we can't stat
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  walk(dir);
  return files;
}

function detectScriptsInFile(filePath: string): ScriptDetection[] {
  const detections: ScriptDetection[] = [];
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relPath = relative(process.cwd(), filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check for known scripts
    for (const [pattern, info] of Object.entries(KNOWN_SCRIPTS)) {
      if (line.toLowerCase().includes(pattern.toLowerCase())) {
        // Check if it's using next/script
        const usesNextScript =
          content.includes("import Script from 'next/script'") ||
          content.includes('import Script from "next/script"') ||
          content.includes("from 'next/script'") ||
          content.includes('from "next/script"');

        // Check if it's blocking (synchronous script tag without async/defer)
        const isBlocking =
          /<script[^>]*src=/.test(line) &&
          !line.includes("async") &&
          !line.includes("defer") &&
          !line.includes("strategy=");

        // Avoid duplicate detections for same script in same file
        const alreadyDetected = detections.find(
          (d) => d.script === pattern && d.file === relPath
        );

        if (!alreadyDetected) {
          detections.push({
            script: pattern,
            name: info.name,
            size: info.size,
            category: info.category,
            file: relPath,
            line: lineNum,
            isBlocking,
            usesNextScript,
          });
        }
      }
    }
  }

  return detections;
}

// ─────────────────────────────────────────────
// Audit Logic
// ─────────────────────────────────────────────

function runAudit(): AuditResult {
  const allDetections: ScriptDetection[] = [];

  for (const dir of SCAN_DIRS) {
    const dirPath = join(process.cwd(), dir);
    if (!existsSync(dirPath)) continue;

    const files = getAllFiles(dirPath);
    for (const file of files) {
      const detections = detectScriptsInFile(file);
      allDetections.push(...detections);
    }
  }

  // Calculate summary
  const byCategory: Record<string, number> = {};
  for (const detection of allDetections) {
    byCategory[detection.category] = (byCategory[detection.category] || 0) + 1;
  }

  const blocking = allDetections.filter((d) => d.isBlocking).length;
  const notUsingNextScript = allDetections.filter(
    (d) => !d.usesNextScript
  ).length;

  // Generate recommendations
  const recommendations: string[] = [];

  if (blocking > 0) {
    recommendations.push(
      "Use async/defer or next/script with strategy='lazyOnload' for non-critical scripts"
    );
  }

  if (byCategory["analytics"] && byCategory["analytics"] > 2) {
    recommendations.push(
      `${byCategory["analytics"]} analytics scripts detected — consider consolidating with a tag manager`
    );
  }

  if (byCategory["support"] && byCategory["support"] > 1) {
    recommendations.push(
      "Multiple support widgets detected — each adds significant JavaScript"
    );
  }

  if (notUsingNextScript > 0) {
    recommendations.push(
      "Use next/script for better loading control and performance"
    );
  }

  return {
    detections: allDetections,
    summary: {
      total: allDetections.length,
      byCategory,
      blocking,
      notUsingNextScript,
    },
    recommendations,
  };
}

// ─────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────

function printResults(result: AuditResult) {
  console.log("\n\x1b[1mThird-Party Script Audit\x1b[0m");
  console.log("=".repeat(50));
  console.log(
    "\x1b[33m⚠ This is an informational audit (does not block)\x1b[0m\n"
  );

  if (result.detections.length === 0) {
    console.log("\x1b[32m✓ No third-party scripts detected\x1b[0m\n");
    console.log("=".repeat(50));
    console.log(
      "\x1b[32m\x1b[1mThird-Party Audit: PASSED (0 scripts)\x1b[0m\n"
    );
    return;
  }

  // Group by category
  const byCategory: Record<string, ScriptDetection[]> = {};
  for (const detection of result.detections) {
    if (!byCategory[detection.category]) {
      byCategory[detection.category] = [];
    }
    byCategory[detection.category].push(detection);
  }

  // Print by category
  for (const [category, detections] of Object.entries(byCategory)) {
    console.log(`\x1b[1m${category.toUpperCase()}\x1b[0m`);

    for (const d of detections) {
      const status = d.isBlocking
        ? "\x1b[31m[BLOCKING]\x1b[0m"
        : d.usesNextScript
          ? "\x1b[32m[OK]\x1b[0m"
          : "\x1b[33m[CHECK]\x1b[0m";

      console.log(`  ${status} ${d.name} (${d.size})`);
      console.log(`         ${d.file}:${d.line}`);
    }
    console.log();
  }

  // Summary
  console.log("\x1b[1mSummary:\x1b[0m");
  console.log(`  Total scripts: ${result.summary.total}`);
  console.log(`  Blocking scripts: ${result.summary.blocking}`);

  // Recommendations
  if (result.recommendations.length > 0) {
    console.log("\n\x1b[1mRecommendations:\x1b[0m");
    for (const rec of result.recommendations) {
      console.log(`  \x1b[36m• ${rec}\x1b[0m`);
    }
  }

  console.log("\n" + "=".repeat(50));

  if (result.summary.blocking > 0) {
    console.log(
      `\x1b[33m\x1b[1mThird-Party Audit: WARNING (${result.summary.blocking} blocking script(s))\x1b[0m\n`
    );
  } else {
    console.log(
      `\x1b[32m\x1b[1mThird-Party Audit: PASSED (${result.summary.total} script(s) detected)\x1b[0m\n`
    );
  }

  // This is warning-only, so we don't exit with error
}

// ─────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────

const result = runAudit();
printResults(result);
