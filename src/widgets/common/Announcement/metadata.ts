import type { VariantMetadata } from "../../section-metadata";

/** Variant metadata (PRD §7.3 minus source_theme — provenance in local docs). */
export const AnnouncementMetadata: Record<"v1" | "v2" | "v3", VariantMetadata> =
  {
    v1: {
      variant_key: "v1",
      name: "Minimal Bar",
      description:
        "Slim centered bar (~38px): one static message or a prev/next carousel with slide-and-fade transitions and optional auto-rotate.",
      preview_image: "preview/v1.png",
      industries: ["general", "fashion", "beauty"],
      vibes: ["minimal", "premium"],
      goals: ["conversion", "brand_awareness"],
      content_density: "sparse",
      page_types: ["homepage", "collection", "pdp", "landing"],
    },
    v2: {
      variant_key: "v2",
      name: "Crossfade Slider",
      description:
        "Rich-text messages with per-message typography that crossfade on a timer; hover pauses; chevron arrows; page or full width.",
      preview_image: "preview/v2.png",
      industries: ["general", "electronics", "home_living"],
      vibes: ["minimal", "premium"],
      goals: ["conversion", "brand_awareness"],
      content_density: "sparse",
      page_types: ["homepage", "collection", "pdp", "landing"],
    },
    v3: {
      variant_key: "v3",
      name: "Marquee Ticker",
      description:
        "Tinted full-bleed ticker: bold uppercase lead + text slide left one-per-hold on a seamless loop; side-by-side mode; optional sticky pinning.",
      preview_image: "preview/v3.png",
      industries: ["general", "food_beverages", "kids_baby", "sports_fitness"],
      vibes: ["bold", "playful"],
      goals: ["conversion", "product_discovery"],
      content_density: "sparse",
      page_types: ["homepage", "collection", "pdp", "landing"],
    },
  };
