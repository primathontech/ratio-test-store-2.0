import sectionDef from "./section";
import enTranslations from "./translations/en.json";

export default {
  ...sectionDef,
  previewImage: "/ratio/section-previews/rich-text.png",
  previewAlt: "Rich Text",
  defaultTranslations: {
    en: enTranslations,
  },
};
