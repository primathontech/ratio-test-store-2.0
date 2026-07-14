import type { VariantMetadata } from "../../section-metadata";

/**
 * Variant metadata (PRD §7.3, minus source_theme — provenance lives in the
 * local extraction docs). Consumed by the editor "choose a style" flow and
 * the AI storefront generator.
 */
export const HeroMetadata: Record<"v1" | "v2" | "v3" | "v4", VariantMetadata> =
  {
    v1: {
      variant_key: "v1",
      name: "Image Banner",
      description:
        "Two full-bleed images side by side with overlaid heading, text and up to two CTAs; optional parallax scroll.",
      preview_image: "preview/v1.png",
      industries: ["fashion", "jewelry_accessories", "general"],
      vibes: ["minimal", "premium"],
      goals: ["brand_awareness", "product_discovery"],
      content_density: "sparse",
      page_types: ["homepage", "landing", "collection"],
    },
    v2: {
      variant_key: "v2",
      name: "Media Hero",
      description:
        "Block-composed hero over image/video media slots; color schemes, gradient overlay and blurred-reflection effects.",
      preview_image: "preview/v2.png",
      industries: ["home_living", "beauty", "general"],
      vibes: ["premium", "earthy"],
      goals: ["brand_awareness", "conversion"],
      content_density: "balanced",
      page_types: ["homepage", "landing"],
    },
    v3: {
      variant_key: "v3",
      name: "Video Hero",
      description:
        "Ambient background video with centered heading, subtitle and CTA; optional in-page video lightbox.",
      preview_image: "preview/v3.png",
      industries: ["fashion", "sports_fitness", "general"],
      vibes: ["bold", "premium"],
      goals: ["brand_awareness"],
      content_density: "sparse",
      page_types: ["homepage", "landing"],
    },
    v4: {
      variant_key: "v4",
      name: "Shoppable Hero",
      description:
        "Full-bleed hero image with product hotspots — click a dot for a product mini-card and quick-shop modal with real add-to-cart.",
      preview_image: "preview/v4.png",
      industries: ["fashion", "beauty", "home_living", "general"],
      vibes: ["premium", "playful"],
      goals: ["conversion", "product_discovery"],
      content_density: "balanced",
      page_types: ["homepage", "landing", "collection"],
    },
  };
