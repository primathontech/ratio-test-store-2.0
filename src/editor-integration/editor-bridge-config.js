/**
 * Editor-bridge origin allowlist. CommonJS so both next-config.js
 * (build-time CSP frame-ancestors header) and the iframe-side mount
 * (runtime origin gate + postMessage targetOrigin) read from the same
 * list — single source so the two cannot drift.
 *
 * NEXT_PUBLIC_EDITOR_ORIGIN sets the allowed editor origin(s) — a single
 * origin, or several comma-separated (e.g. the deployed editor + a local dev
 * editor, or the new editor + the legacy GK page app during the transition).
 * Each entry is trimmed; blanks are dropped. Unset → empty list → bridge fails
 * closed (no embedding via CSP, no postMessage exchange).
 */

const ALLOWED_EDITOR_ORIGINS = Object.freeze(
  (process.env.NEXT_PUBLIC_EDITOR_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

module.exports = { ALLOWED_EDITOR_ORIGINS };
