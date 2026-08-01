import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Addresses Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-addresses",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [
    // Addresses Section
    {
      id: "addresses-section",
      name: "Addresses",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 0, bottom: 20, left: 0 } },
          tablet: { padding: { top: 30, right: 0, bottom: 30, left: 0 } },
          desktop: { padding: { top: 40, right: 0, bottom: 40, left: 0 } },
        },
      },
      widgets: [
        {
          id: "nintarababy-addresses",
          name: "Addresses",
          type: WIDGET_TYPES.Addresses,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
