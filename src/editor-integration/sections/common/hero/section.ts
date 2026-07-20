import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";
import { HeroDefaults } from "@/widgets/common/Hero/defaults";

export default {
  id: "hero-section",
  name: "Hero",
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
      id: "hero-widget",
      name: "Hero",
      type: WIDGET_TYPES.Hero,
      settings: { ...HeroDefaults },
    },
  ],
};
