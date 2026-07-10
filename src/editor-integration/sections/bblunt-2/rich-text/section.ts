import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "rich-text-section",
  name: "Rich Text",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: false,

  settings: {
    layout: SECTION_LAYOUT_OPTIONS.FULL,
    responsive: {
      mobile: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      tablet: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      desktop: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    },
  },

  widgets: [
    {
      id: "rich-text-widget",
      name: "Rich Text",
      type: WIDGET_TYPES.RichText,
      settings: {
        variant: "v1",
        body: "t:sections.rich_text.content__rich",
      },
    },
  ],
};
