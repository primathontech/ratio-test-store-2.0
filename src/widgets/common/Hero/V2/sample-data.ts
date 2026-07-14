import type { HeroMediaItem, HeroBlock, HeroSettings } from "./types";

/**
 * Media hero (v2) fallback content — the section must look GREAT with zero
 * settings (fresh palette add / AI-storefront instantiation), per the
 * settings → data → sample fall-through rule.
 *
 * The curated look: large hero, gradient scrim for text protection, centered
 * white display heading + subtitle, white outline CTA, and the variant's
 * signature blurred reflection below. Applied ONLY when the section is
 * entirely unconfigured — any real content/media from the editor or template
 * replaces it wholesale.
 */

export const SAMPLE_MEDIA: HeroMediaItem[] = [
  {
    desktopImage: "/widgets/Hero/V2/hero.jpg",
    mobileImage: "",
    alt: "Two models wearing sweaters from our latest collection.",
  },
];

export const SAMPLE_BLOCKS: HeroBlock[] = [
  {
    type: "text",
    settings: {
      text: "New arrivals",
      type_preset: "custom",
      font_size: "56px",
      color: "#ffffff",
      max_width: "normal",
    },
  },
  {
    type: "text",
    settings: {
      text: "Fresh silhouettes in warm light — the season's edit is here.",
      type_preset: "paragraph",
      color: "rgba(255, 255, 255, 0.85)",
      max_width: "narrow",
    },
  },
  {
    type: "button",
    settings: {
      label: "Shop now",
      link: "/collections/all",
      style_class: "button-secondary",
    },
  },
];

/** Section-level styling for the curated zero-settings look. */
export const SAMPLE_SECTION: Partial<HeroSettings> = {
  section_height: "large",
  horizontal_alignment_flex_direction_column: "center",
  vertical_alignment_flex_direction_column: "center",
  toggle_overlay: true,
  overlay_style: "gradient",
  gradient_direction: "to top",
  overlay_color: "rgb(0 0 0 / 0.45)",
  // White outline CTA over the photo (root CSS-var overrides).
  cta_background: "#ffffff",
  cta_text_color: "#ffffff",
  // The variant's signature effect — part of what makes v2 distinctive.
  blurred_reflection: true,
};
