import customHtml from "@/editor-integration/sections/common/custom-html";
import hero from "@/editor-integration/sections/common/hero";
import faq from "@/editor-integration/sections/common/faq";
import announcement from "@/editor-integration/sections/common/announcement";

const commonSections = {
  "custom-html": customHtml,
  hero,
  faq,
  announcement,
};

export const availableSectionsRegistry = {
  availableSections: {
    ...commonSections,
  },
};
