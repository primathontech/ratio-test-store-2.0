import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "announcement-bar-section",
  name: "Announcement Bar",
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
      id: "announcement-bar-widget",
      name: "Announcement Bar",
      type: WIDGET_TYPES.AnnouncementBar,
      settings: {
        variant: "v1",
        backgroundColor: "#000000",
        textColor: "#ffffff",
        speed: 35,
        pauseOnHover: true,
        items: "t:common.announcement_bar__rich",
      },
    },
  ],
};
