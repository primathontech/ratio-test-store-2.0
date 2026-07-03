import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Order-history template — rendered at `/pages/orders` for logged-in users.
 *
 * Shows the customer's previous orders via the `Orders` widget. The
 * pre-existing `orders` template is reserved for the post-checkout
 * confirmation redirect (`/orders?orderId=...`) and renders different
 * content; that's why this lives under its own template name.
 */
export const template: PageConfig = {
  id: "bblunt-2-order-history",
  dataSources: {},
  sections: [
    // Orders content
    {
      id: "orders-content-section",
      name: "Orders Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-orders-widget",
          name: "Orders",
          type: WIDGET_TYPES.Orders,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
