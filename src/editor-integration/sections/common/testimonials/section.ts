import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "testimonials-section",
  name: "Testimonials",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: true,

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
      id: "ratio-testimonials",
      name: "Testimonials",
      type: WIDGET_TYPES.Testimonials,
      settings: {
        variant: "v1",
        heading: "t:sections.testimonials.heading__rich",
        testimonials: "t:sections.testimonials.items",
      },
    },
  ],
};
