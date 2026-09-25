import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Home Page Template — generic, merchant-agnostic store home.
 *
 * A single `HomeShowcase` widget renders the whole landing experience
 * (hero → trust badges → featured products → shop-by-collection). It fetches
 * the configured merchant's own collections and products client-side, with NO
 * hardcoded handles or IDs — so changing `NEXT_PUBLIC_MERCHANT_ID` swaps the
 * entire home to that merchant's catalog with zero code changes.
 */
export const template: PageConfig = {
  id: "ratio-home",
  dataSources: {},
  sections: [
    {
      id: "home-showcase-section",
      name: "Home Showcase",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        // Spacing is handled inside the HomeShowcase widget.
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "home-showcase",
          name: "Home Showcase",
          type: WIDGET_TYPES.HomeShowcase,
          settings: {
            variant: "v1",
          },
        },
      ],
    },

    {
      id: "video-app-section",
      name: "Video App",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 56, right: 16, bottom: 56, left: 16 } },
          tablet: { padding: { top: 56, right: 16, bottom: 56, left: 16 } },
          desktop: { padding: { top: 56, right: 16, bottom: 56, left: 16 } },
        },
      },
      widgets: [
        {
          id: "video-app-home",
          name: "Video App",
          type: WIDGET_TYPES.VideoApp,
          settings: {
            variant: "v1",
            title: "Watch & Shop",
            layout: "grid",
            itemsPerRow: 4,
            enableCtaButton: false,
          },
        },
      ],
    },

    {
      id: "ratio-form-section",
      name: "Ratio Form",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 56, right: 16, bottom: 56, left: 16 } },
          tablet: { padding: { top: 56, right: 16, bottom: 56, left: 16 } },
          desktop: { padding: { top: 56, right: 16, bottom: 56, left: 16 } },
        },
      },
      widgets: [
        {
          id: "ratio-form",
          name: "Ratio Form",
          type: WIDGET_TYPES.RatioForm,
          settings: {
            variant: "v1",
            formId: "form_yZ25ONWPeLuYSDw3",
          },
        },
      ],
    },
  ],
};
