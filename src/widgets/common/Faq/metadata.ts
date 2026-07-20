import type { VariantMetadata } from "../../section-metadata";

/** Variant metadata (PRD §7.3 minus source_theme — provenance in local docs). */
export const FaqMetadata: Record<"v1" | "v2" | "v3", VariantMetadata> = {
  v1: {
    variant_key: "v1",
    name: "Collapsible Content",
    description:
      "Caption + centered heading over a narrow column of hairline <details> rows; optional side image and bordered-card row style. Zero client JS.",
    preview_image: "preview/v1.png",
    industries: ["general", "fashion", "beauty", "home_living"],
    vibes: ["minimal", "premium"],
    goals: ["conversion", "brand_awareness"],
    content_density: "balanced",
    page_types: ["homepage", "pdp", "landing"],
  },
  v2: {
    variant_key: "v2",
    name: "Accordion",
    description:
      "Heading over flat accordion rows with caret/plus toggle icons, dividers, and per-row open-by-default. Zero client JS.",
    preview_image: "preview/v2.png",
    industries: ["general", "electronics", "health_wellness"],
    vibes: ["minimal"],
    goals: ["conversion"],
    content_density: "dense",
    page_types: ["homepage", "pdp", "landing", "account"],
  },
  v3: {
    variant_key: "v3",
    name: "Animated Accordion",
    description:
      "Single-open accordion with circled chevrons and smooth height animation — one question open at a time (client state).",
    preview_image: "preview/v3.png",
    industries: ["general", "fashion", "kids_baby", "food_beverages"],
    vibes: ["playful", "bold"],
    goals: ["conversion", "product_discovery"],
    content_density: "balanced",
    page_types: ["homepage", "pdp", "landing"],
  },
};
