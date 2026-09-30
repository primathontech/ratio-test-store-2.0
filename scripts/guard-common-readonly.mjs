#!/usr/bin/env node
/**
 * Read-only guard for the common section library.
 *
 * `src/widgets/common/**` is the SHARED, upstream-owned section library. It is
 * authored in the library home (storefront-builder core / storefront-starter)
 * and flows into merchant forks via upstream-sync PRs. Merchant devs must NOT
 * edit it locally — a local change would be silently overwritten on the next
 * sync and, worse, forks the section away from every other merchant.
 *
 * This guard runs in the pre-commit hook that ships inside storefront-starter.
 * In a MERCHANT FORK that hook is the active repo hook, so the guard fires. In
 * the core monorepo the root hook runs instead (this file is not invoked), so
 * the library team is never blocked.
 *
 * Escape hatch (for the upstream-sync bot / an intentional library change made
 * from a fork): set ALLOW_COMMON_EDITS=1 in the environment for that commit.
 *   ALLOW_COMMON_EDITS=1 git commit ...
 *
 * Exits 1 and lists the offending files when a staged change touches common/.
 */
import { execSync } from "node:child_process";

if (process.env.ALLOW_COMMON_EDITS === "1") {
  process.exit(0);
}

// Marker inside common/ that identifies which prefix a staged path uses.
const COMMON_SEGMENT = "src/widgets/common/";

let staged = "";
try {
  staged = execSync("git diff --cached --name-only --diff-filter=ACMR", {
    encoding: "utf8",
  });
} catch {
  // If git isn't available for some reason, don't block the commit.
  process.exit(0);
}

const offending = staged
  .split("\n")
  .map((f) => f.trim())
  .filter(Boolean)
  .filter((f) => f.includes(COMMON_SEGMENT));

if (offending.length === 0) {
  process.exit(0);
}

console.error(`
🔒 Common section library is read-only in merchant repos.

You staged changes under ${COMMON_SEGMENT}:
${offending.map((f) => `  • ${f}`).join("\n")}

These files are owned upstream and synced into this repo — a local edit will be
overwritten on the next upstream-sync and diverges you from every other
merchant. Do one of:

  • Revert the change here and request it upstream (the shared library repo).
  • Need a merchant-only variation? Add a LOCAL override widget instead of
    editing common/.
  • Genuinely an upstream change made from this fork (or the sync bot)?
    Re-run with:  ALLOW_COMMON_EDITS=1 git commit ...
`);

process.exit(1);
