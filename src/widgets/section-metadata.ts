/**
 * Variant-metadata contract (PRD §7.3 minus source_theme — provenance lives in
 * local extraction docs only). Every common section exports metadata.ts using
 * these types; the enums make illegal values a compile error.
 * Consumers: editor "choose a style" (preview_image) and the AI generator.
 */
export type Industry =
  | "fashion"
  | "beauty"
  | "food_beverages"
  | "health_wellness"
  | "electronics"
  | "home_living"
  | "kids_baby"
  | "jewelry_accessories"
  | "sports_fitness"
  | "general";

export type Vibe = "minimal" | "bold" | "premium" | "playful" | "earthy";

export type Goal =
  | "conversion"
  | "brand_awareness"
  | "product_discovery"
  | "repeat_purchase";

export type ContentDensity = "sparse" | "balanced" | "dense";

export type PageType =
  | "homepage"
  | "pdp"
  | "collection"
  | "cart"
  | "blog"
  | "landing"
  | "account"
  | "error";

export interface VariantMetadata {
  variant_key: string; // "v1", "v2", …
  name: string;
  description?: string;
  /** Path relative to the section folder, e.g. "preview/v1.png". */
  preview_image: string;
  industries: [Industry, ...Industry[]]; // ≥1 (PRD rule)
  vibes: [Vibe, ...Vibe[]]; // ≥1 (PRD rule)
  goals: Goal[];
  content_density: ContentDensity;
  page_types: PageType[];
}
