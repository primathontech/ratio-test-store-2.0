import customHtml from "@/editor-integration/sections/common/custom-html";
import hero from "@/editor-integration/sections/common/hero";
import faq from "@/editor-integration/sections/common/faq";

const commonSections = {
  "custom-html": customHtml,
  hero,
  faq,
};

export const availableSectionsRegistry = {
  availableSections: {
    ...commonSections,
  },
};
