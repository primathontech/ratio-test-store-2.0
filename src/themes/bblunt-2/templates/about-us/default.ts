import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * About Us Page Template for bblunt-2
 */
export const template: PageConfig = {
  id: "bblunt-2-about-us",
  dataSources: {},
  sections: [
    // About Us Hero Section
    {
      id: "about-us-hero-section",
      name: "About Us Hero",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 20, bottom: 20, left: 20 } },
          tablet: { padding: { top: 20, right: 20, bottom: 20, left: 20 } },
          desktop: { padding: { top: 20, right: 20, bottom: 20, left: 20 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-about-us-hero",
          name: "About Us Hero",
          type: WIDGET_TYPES.AboutUsHero,
          settings: {
            variant: "v1",
            imageSrc: "t:bblunt-2_about-us_default.hero.imageSrc",
            href: "t:bblunt-2_about-us_default.hero.href",
          },
        },
      ],
    },

    // About Us Story Section
    {
      id: "about-us-story-section",
      name: "About Us Story",
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
          id: "bblunt-2-about-us-story",
          name: "About Us Story",
          type: WIDGET_TYPES.AboutUsStory,
          settings: {
            variant: "v1",
            blocks: "t:bblunt-2_about-us_default.story.blocks",
          },
        },
      ],
    },

    // About Us Values Section
    {
      id: "about-us-values-section",
      name: "About Us Values",
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
          id: "bblunt-2-about-us-values",
          name: "About Us Values",
          type: WIDGET_TYPES.AboutUsValues,
          settings: {
            variant: "v1",
            items: "t:bblunt-2_about-us_default.values.items",
          },
        },
      ],
    },
  ],
};
