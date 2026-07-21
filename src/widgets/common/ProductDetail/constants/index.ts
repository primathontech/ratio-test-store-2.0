/**
 * Default sizing / styling constants for the product gallery.
 * Values mirror the bblunt PDP reference template (see
 * `docs/PDP_PRODUCT_GALLERY_FLOW.md` §1).
 */

export const GALLERY_CONFIG = {
  // Arrow configuration
  DEFAULT_ARROW_SIZE: 40,
  ARROW_STROKE_WIDTH_RATIO: 0.083,
  MIN_ARROW_STROKE_WIDTH: 1,

  // Thumbnail configuration
  DEFAULT_THUMBNAIL_SIZE: 80,
  DEFAULT_THUMBNAIL_SPACING: 8,
  DEFAULT_THUMBNAIL_RADIUS: 4,
  DEFAULT_ACTIVE_BORDER_WIDTH: 2,

  // Animation durations (ms)
  TRANSITION_DURATION: 300,
  FADE_DURATION: 400,
  SLIDE_DURATION: 500,

  // Breakpoints
  MOBILE_BREAKPOINT: 768,

  // Z-index layers
  Z_INDEX: {
    THUMBNAILS: 10,
    ARROWS: 20,
    HOVER_PREVIEW: 10000,
    LIGHTBOX: 9999,
  },

  // Hover preview configuration
  HOVER_PREVIEW: {
    DEFAULT_SIZE_MULTIPLIER: 1.5,
    DEFAULT_RADIUS: 8,
    DEFAULT_BORDER_WIDTH: 2,
    DEFAULT_BORDER_COLOR: "#ffffff",
    DEFAULT_SHADOW_COLOR: "rgba(0, 0, 0, 0.3)",
    DEFAULT_SHADOW_BLUR: 10,
    DEFAULT_SHADOW_OFFSET_X: 0,
    DEFAULT_SHADOW_OFFSET_Y: 4,
    DEFAULT_OPACITY: 1,
    DEFAULT_ANIMATION_DURATION: 200,
    DEFAULT_DELAY: 300,
    DEFAULT_POSITION: "right" as const,
    DEFAULT_OFFSET: 20,
  },

  // Selection box configuration
  SELECTION_BOX: {
    DEFAULT_SHOW: true,
    DEFAULT_BORDER_COLOR: "#000000",
    DEFAULT_BORDER_WIDTH: 2,
    DEFAULT_BACKGROUND_OPACITY: 0.2,
  },
} as const;

/**
 * ratio-tuned gallery defaults — the widget uses these directly,
 * there is no settings-driven tuning today.
 */
export const GALLERY_DEFAULTS = {
  layout: "vertical" as const,
  mainImageRadius: 0,
  showNavigationArrows: true,
  navigationArrowSize: 46,
  navigationArrowBgColor: "#ffffff",
  navigationArrowIconColor: "#000000",
  navigationArrowShape: "circle" as const,
  thumbnailSize: 81,
  thumbnailRadius: 6,
  thumbnailSpacing: 16,
  mobileThumbnailSpacing: 10,
  activeThumbnailBorderColor: "#000000",
  activeThumbnailBorderWidth: 2,
  thumbnailLayout: "single-row" as const,
  showThumbnailArrows: false,
  enableHoverPreview: true,
  autoPlay: false,
  autoPlayInterval: 1500,
  autoPlayAnimation: "slide-left" as const,
  pauseOnHover: true,
  enableZoom: true,
  lightboxBgColor: "rgba(255, 255, 255, 1)",
  lightboxOverlayOpacity: 1,
  zoomIconColor: "#000",
  /** Default green tag color used by `getProductLabel` when no merchant override is provided. */
  productLabelBackground: "#82c341",
};
