/**
 * Shared color-scheme → CSS variable mapping.
 *
 * The theme provider injects every scheme's raw tokens globally
 * (theme.json `config.colors.scheme-N-*` → `--color-scheme-N-*`). This helper
 * maps a single scheme id to the GENERIC `--color-*` variables a section root
 * exposes, each pointing at that scheme's token. Spread it onto any widget's
 * root that has a `color_scheme` setting:
 *
 *   <section style={{ ...schemeColorVars(settings.color_scheme) }}>
 *
 * The widget's components/CSS then read the generic names
 * (`--color-foreground`, `--color-primary-button-background`, …) and the
 * editor's `color_scheme` setting swaps which scheme the section resolves to.
 *
 * Centralized so every widget emits the same complete set (base colors,
 * border, and the primary/secondary button tokens) — add a token once
 * here and all scheme-aware widgets pick it up.
 */

/** The color scheme ids (theme.json defines tokens for each). */
export const SCHEME_IDS = [
  "scheme-1",
  "scheme-2",
  "scheme-3",
  "scheme-4",
  "scheme-5",
] as const;

export type SchemeId = (typeof SCHEME_IDS)[number];

const VALID_SCHEMES = new Set<string>(SCHEME_IDS);
const DEFAULT_SCHEME: SchemeId = "scheme-1";

/**
 * Generic scheme tokens, in `generic name → scheme token suffix` form. The
 * generic var is what components read; the suffix resolves to the active
 * scheme's `--color-scheme-N-{suffix}` token from theme.json.
 */
const SCHEME_TOKENS: Record<string, string> = {
  "--color-background": "background",
  "--color-foreground": "foreground",
  "--color-foreground-heading": "foreground-heading",
  "--color-primary": "primary",
  "--color-muted": "muted",
  "--color-border": "border",
  // Buttons — per-scheme primary/secondary button tokens.
  "--color-primary-button-background": "primary-button-background",
  "--color-primary-button-text": "primary-button-text",
  "--color-primary-button-border": "primary-button-border",
  "--color-primary-button-hover-background": "primary-button-hover-background",
  "--color-primary-button-hover-text": "primary-button-hover-text",
  "--color-primary-button-hover-border": "primary-button-hover-border",
  "--color-secondary-button-background": "secondary-button-background",
  "--color-secondary-button-text": "secondary-button-text",
  "--color-secondary-button-border": "secondary-button-border",
  "--color-secondary-button-hover-background":
    "secondary-button-hover-background",
  "--color-secondary-button-hover-text": "secondary-button-hover-text",
  "--color-secondary-button-hover-border": "secondary-button-hover-border",
};

/** Map a scheme id → the generic `--color-*` variables for a section root. */
export function schemeColorVars(id?: string): Record<string, string> {
  const sid = id && VALID_SCHEMES.has(id) ? id : DEFAULT_SCHEME;
  const vars: Record<string, string> = {};
  for (const [generic, token] of Object.entries(SCHEME_TOKENS)) {
    vars[generic] = `var(--color-${sid}-${token})`;
  }
  return vars;
}
