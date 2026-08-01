/**
 * Shared collection navigation constants.
 *
 * Used by Header (navbar dropdowns) and CategoryTabBar (pill tabs).
 * Edit this file to update nav structure across both widgets.
 */

/** Top-level nav items shown in the header, in display order */
export const TOP_LEVEL_ORDER = [
  "shop-all",
  "bestseller",
  "baby-care",
  "mom-care",
  "essentials",
] as const;

/** Handles that should NOT show a dropdown in the Header navbar */
export const NO_DROPDOWN: readonly string[] = ["shop-all", "bestseller"];

/**
 * Parent handle → child collection handles.
 *
 * - Header uses this to build dropdown menus under parent nav items (except NO_DROPDOWN).
 * - CategoryTabBar uses this to show contextual pills on each collection page.
 */
export const PARENT_CHILDREN: Record<string, string[]> = {
  "shop-all": ["bestseller", "baby-care", "mom-care", "essentials"],
  bestseller: ["bestseller", "baby-care", "mom-care", "essentials"],
  "baby-care": ["baby-wash", "baby-shampoo", "baby-face-cream", "baby-lotion"],
  "mom-care": ["under-eye"],
  essentials: [
    "diaper-rash-cream",
    "natural-water-wipes",
    "all-day-baby-wipes",
  ],
};
