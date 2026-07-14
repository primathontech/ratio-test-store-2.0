import customHtml from "@/editor-integration/sections/common/custom-html";
import hero from "@/editor-integration/sections/common/hero";

const commonSections = {
  "custom-html": customHtml,
  hero,
};

export const availableSectionsRegistry = {
  availableSections: {
    ...commonSections,
  },
};
