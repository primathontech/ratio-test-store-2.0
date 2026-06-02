/**
 * Editor-bridge origin allowlist. CommonJS so both next-config.js
 * (build-time CSP frame-ancestors header) and the iframe-side mount
 * (runtime origin gate + postMessage targetOrigin) read from the same
 * list — single source so the two cannot drift.
 *
 * NEXT_PUBLIC_EDITOR_ORIGIN sets the one allowed editor origin. Unset
 * → empty list → bridge fails closed (no embedding via CSP, no
 * postMessage exchange).
 */

const editorOrigin = process.env.NEXT_PUBLIC_EDITOR_ORIGIN;

const ALLOWED_EDITOR_ORIGINS = Object.freeze(
  editorOrigin ? [editorOrigin] : []
);

module.exports = { ALLOWED_EDITOR_ORIGINS };
