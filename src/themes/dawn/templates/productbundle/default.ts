import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Product Bundle Page Template for dawn
 *
 * Route: /productbundle/[bundleId]
 *
 * Layout: AnnouncementBar -> Header -> ProductBundle widget (loads GoKwik
 * ProductBundler SDK) -> Footer -> BottomBar.
 *
 * The bundle itself is built in the GoKwik dashboard (Bundle App / Product
 * Builder); this page hosts the SDK that renders that bundle by its id.
 */
export const template: PageConfig = {
  id: "dawn-product-bundle",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [
    // Product Bundle Section
    {
      id: "product-bundle-section",
      name: "Product Bundle",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 28, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-product-bundle",
          name: "Product Bundle",
          type: WIDGET_TYPES.ProductBundle,
          settings: {
            variant: "v1",
          },
        },
      ],
    },
  ],
};
