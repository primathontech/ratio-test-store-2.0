/**
 * Copy the Apps Platform sandbox shell into `public/apps-platform/`.
 *
 * The shell is the document each app's iframe loads. It ships inside
 * `@shopkit/apps-platform`, so it is resolved from the installed package rather
 * than copied by hand — a hand-copied shell silently goes stale when the
 * package updates, and the mismatch only shows as apps failing to boot.
 *
 * Serving it from `public/` keeps it same-origin, which matters only for the
 * fetch: the iframe is sandboxed to an opaque origin either way.
 *
 * No-op when the Apps Platform is off, and never fatal — a storefront that does
 * not use apps must still build.
 */
import { createRequire } from "node:module";
import { copyFile, mkdir, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const DEST = join(process.cwd(), "public", "apps-platform", "sandbox.html");

/**
 * Read `NEXT_PUBLIC_APPS_PLATFORM_ENABLED` the way Next.js would.
 *
 * This script runs under plain `node`, which does NOT load `.env*` files — only
 * the Next build does. The flag normally lives in `.env.local` (dev) or a `.env`
 * written from a Docker secret (CI), so reading `process.env` alone reports it
 * unset and the shell silently never ships. That failure is invisible until an
 * app fails to boot in production, which is the exact failure mode this whole
 * surface is prone to.
 *
 * Precedence matches Next's: a real environment variable wins, then
 * `.env.local`, then `.env`. Parsing is deliberately minimal — one flag, so
 * there is no case for a dependency.
 */
function readFlag(name) {
  if (process.env[name] !== undefined) return process.env[name];
  for (const file of [".env.local", ".env"]) {
    let text;
    try {
      text = readFileSync(join(process.cwd(), file), "utf8");
    } catch {
      continue;
    }
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (m?.[1] !== name) continue;
      return (m[2] ?? "").trim().replace(/^(['"])(.*)\1$/, "$2");
    }
  }
  return undefined;
}

/**
 * Only ship the shell when apps are actually on.
 *
 * It is a static file, so an unused copy is not itself exploitable — but it is
 * a page that loads and executes a bundle URL handed to it over postMessage,
 * and the CSP allows `frame-ancestors 'self'`. A storefront with apps disabled
 * has no reason to serve one, so it does not.
 *
 * The flag is read from the environment the build already uses, so this follows
 * the same switch as the runtime (`layout.tsx` and `builder.ts` both gate on it)
 * rather than introducing a second one that could disagree.
 */
const APPS_PLATFORM_ENABLED =
  readFlag("NEXT_PUBLIC_APPS_PLATFORM_ENABLED") === "true";

if (!APPS_PLATFORM_ENABLED) {
  // Remove a shell left behind by an earlier build that had the flag on —
  // otherwise turning apps off would leave the old copy being served.
  await rm(dirname(DEST), { recursive: true, force: true }).catch(() => {});
  console.log(
    "[apps-platform] disabled (NEXT_PUBLIC_APPS_PLATFORM_ENABLED is not \"true\") — sandbox shell not shipped"
  );
  process.exit(0);
}

try {
  const require = createRequire(import.meta.url);
  const source = require.resolve("@shopkit/apps-platform/sandbox-shell.html");
  await mkdir(dirname(DEST), { recursive: true });
  await copyFile(source, DEST);
  console.log(
    "[apps-platform] sandbox shell -> public/apps-platform/sandbox.html"
  );
} catch (err) {
  console.warn(
    `[apps-platform] sandbox shell not copied (${err.message}). ` +
      "Apps will not boot until it is present; ignore this if the Apps Platform is off."
  );
}
