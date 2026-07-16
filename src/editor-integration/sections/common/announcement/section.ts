import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";
import { AnnouncementDefaults } from "@/widgets/common/Announcement/defaults";

export default {
  id: "announcement-section",
  name: "Announcement Bar",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: true,

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
      id: "announcement-widget",
      name: "Announcement Bar",
      type: WIDGET_TYPES.Announcement,
      settings: { ...AnnouncementDefaults },
    },
  ],
};
