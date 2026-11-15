import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Content Section — a generic, addable content block backed by the PageContent
 * widget. Suited to policy pages, informational pages, and long-form text.
 * All copy is editor-editable via the translation keys below.
 */
export default {
  id: "content-section",
  name: "Content Section",
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
      id: "content-section-widget",
      name: "Content Section",
      type: WIDGET_TYPES.PageContent,
      settings: {
        variant: "v1",
        eyebrow: "t:sections.content_section.eyebrow",
        title: "t:sections.content_section.title",
        subtitle: "t:sections.content_section.subtitle",
        sections: "t:sections.content_section.sections",
      },
    },
  ],
};
