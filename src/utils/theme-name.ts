/**
 * The theme name, as one definition.
 *
 * Standalone rather than a member of `utils/index.ts` because the A/B edge
 * middleware needs it: that barrel re-exports React hooks, and importing it
 * from middleware pulls them into the edge bundle.
 *
 * The fallback is what makes this worth sharing. Templates, translations and
 * A/B all key off this name, so a deployment missing NEXT_PUBLIC_THEME_NAME
 * must not leave them disagreeing — A/B reading "" while the template loader
 * falls back silently disables every experiment on a site that otherwise looks
 * completely healthy, with no error anywhere to say so.
 */
export function getThemeName(): string {
  return process.env.NEXT_PUBLIC_THEME_NAME || "dawn";
}
