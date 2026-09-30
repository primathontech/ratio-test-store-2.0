import type { ShoppableHeroHotspot, ShoppableHeroImage } from "./types";

/**
 * Shoppable hero (v4) fallback content — the section renders (and looks great)
 * with ZERO settings, per the settings → data → sample fall-through rule.
 * Positions are exact percent offsets from the source look's live harvest;
 * the mobile box is a different (taller) aspect, so each hotspot carries its
 * own mobile percents.
 */

export const SAMPLE_HEADING = "Easy by design";

export const SAMPLE_SUBHEADING =
  "Soft texture, effortless movement, warm-weather pieces designed to be worn on repeat.";

export const SAMPLE_CTA_TEXT = "Shop Linen";

export const SAMPLE_CTA_HREF = "/collections";

/** Full-bleed hero image (decorative → alt=""). Desktop = landscape 1536×1024. */
export const SAMPLE_IMAGE: ShoppableHeroImage = {
  src: "/widgets/Hero/V4/hero-bg.jpg",
  alt: "",
};

/** Portrait crop (800×869) for the mobile box — avoids L/R object-cover crop. */
export const SAMPLE_MOBILE_IMAGE: ShoppableHeroImage = {
  src: "/widgets/Hero/V4/hero-bg-mobile.webp",
  alt: "",
};

export const SAMPLE_HOTSPOTS: ShoppableHeroHotspot[] = [
  {
    x: "25%",
    y: "53%",
    xMobile: "10%",
    yMobile: "61%",
    demoTitle: "The Riva Tank",
    demoPrice: "Rs. 6,100.00",
    demoHref: "/products/the-riva-tank",
  },
  {
    x: "58%",
    y: "49%",
    xMobile: "38%",
    yMobile: "51%",
    demoTitle: "The Lena Midi",
    demoPrice: "Rs. 16,500.00",
    demoHref: "/products/the-lena-midi",
  },
  {
    x: "77%",
    y: "67%",
    xMobile: "83%",
    yMobile: "65%",
    demoTitle: "The Cami",
    demoPrice: "Rs. 5,700.00",
    demoHref: "/products/the-cami",
  },
];

/** Visual defaults (source-look harvest values). */
export const SAMPLE_HOTSPOT_COLOR = "#edebe7";
export const SAMPLE_HOTSPOT_TEXT_COLOR = "#000000";
export const SAMPLE_CTA_BACKGROUND = "#edebe7";
export const SAMPLE_CTA_TEXT_COLOR = "#000000";
export const SAMPLE_OVERLAY_TEXT_COLOR = "#ffffff";
export const SAMPLE_MOBILE_TEXT_COLOR = "#2a3743";
export const SAMPLE_PREHEADING = "";
export const SAMPLE_HEADING_SIZE = "large";
export const SAMPLE_OVERLAY_OPACITY = 10;
export const SAMPLE_TEXT_ALIGNMENT = "left";
export const SAMPLE_TEXT_POSITION = "bottom-left";
export const SAMPLE_HOTSPOT_ICON = "plus";
