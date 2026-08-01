import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * About Us Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-about-us",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [
    // About Us Content Section
    {
      id: "about-us-section",
      name: "About Us",
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
          id: "nintarababy-about-us",
          name: "About Us",
          type: WIDGET_TYPES.AboutUs,
          settings: {
            variant: "v1",
            title: "t:about-us.title",
            heroDesktopImage: "t:about-us.hero_desktop_image",
            heroMobileImage: "t:about-us.hero_mobile_image",
            heroAlt: "t:about-us.hero_alt",
            block1Image: "t:about-us.story_block1_image",
            block1Heading: "t:about-us.story_block1_heading",
            block1Text: "t:about-us.story_block1_text",
            block2Image: "t:about-us.story_block2_image",
            block2Heading: "t:about-us.story_block2_heading",
            block2Text: "t:about-us.story_block2_text",
            block3Image: "t:about-us.story_block3_image",
            block3Heading: "t:about-us.story_block3_heading",
            block3Text: "t:about-us.story_block3_text",
          },
        },
      ],
    },
  ],
};
