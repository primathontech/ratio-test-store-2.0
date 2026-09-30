import sectionDef from "./section";
import enTranslations from "./translations/en.json";

export default {
  ...sectionDef,
  previewImage: "/common/section-previews/content-section.png",
  previewAlt: "Content Section",
  defaultTranslations: {
    en: enTranslations,
  },
};
