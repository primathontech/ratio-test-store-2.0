import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "collection-timer-section",
  name: "Collection Timer",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: false,

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
      id: "collection-timer-widget",
      name: "Collection Timer",
      type: WIDGET_TYPES.CollectionTimer,
      settings: {
        variant: "v1",
        visible: true,
        endDateString: "t:sections.collection_timer.endDateString",
        timerInterval: 1000,
        urgencyText: "t:sections.collection_timer.urgencyText",
        saleLabel: "t:sections.collection_timer.saleLabel",
        expiredText: "t:sections.collection_timer.expiredText",
        backgroundColor: "#ffffff",
        textColor: "#1D1D1D",
        urgencyColor: "#FF0000",
      },
    },
  ],
};
