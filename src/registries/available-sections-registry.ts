import customHtml from "@/sections-library/common/custom-html";

const commonSections = {
  "custom-html": customHtml,
};

//  Theme specific sections
// const bbluntSections = {};

export const availableSectionsRegistry = {
  availableSections: {
    ...commonSections,
    // ...bbluntSections,
  },
};
