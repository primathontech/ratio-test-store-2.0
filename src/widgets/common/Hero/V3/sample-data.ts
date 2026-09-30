import type { HeroVideoSettings } from "./types";

/**
 * HeroVideo (v3) fallback content (code-split out of the component).
 *
 * Every value transcribed VERBATIM from the live harvest. The widget reads each
 * field off `settings` (editor source of truth, populated from en.json via `t:`
 * keys) FIRST and uses these only as the render-time fallback so the section
 * always renders correctly with no settings.
 *
 * - heading/subtitle/CTA: harvest.contentModel + snippet.html
 * - backgroundVideoId `kAaV5gfdsG0`: snippet.html iframe data-video-id (ambient bg;
 *   a YouTube id, NOT a raster image — kept as a plain string)
 * - heights 650 / 422.5: harvest learnings (.hero--650px; mobile 65%)
 * - ctaBackground #edebe7 / ctaTextColor #000: snippet.html inline `!important`
 * - sectionBackground #ffffff: harvest elementStyles div bg
 *
 * Flat shape: each field is read directly as `settings?.X ?? DEFAULT_HERO_VIDEO.X`.
 */
// Library-extension overrides (textSize/headingCase/headingSpacing/
// contentMaxWidth) have no sample values — undefined = the look's original.
export const DEFAULT_HERO_VIDEO: Required<
  Omit<
    HeroVideoSettings,
    | "variant"
    | "textSize"
    | "headingCase"
    | "headingSpacing"
    | "contentMaxWidth"
  >
> = {
  heading: "Made to move with ease",
  headingSize: "60",
  headingColor: "#ffffff",
  subtitle: "Quiet texture, warm light, and pieces designed for slower days.",
  subtitleColor: "#ffffff",
  ctaText: "Explore the lookbook",
  ctaHref: "/pages/the-lookbook",
  backgroundVideoId: "kAaV5gfdsG0",
  videoTitle: "Video hero",
  textAlignment: "middle-center",
  overlayOpacity: "0",
  desktopHeight: "650",
  mobileHeight: "400",
  ctaBackground: "#edebe7",
  ctaTextColor: "#000000",
  sectionBackground: "#ffffff",
};
