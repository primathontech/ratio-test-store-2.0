import sectionDef from "./section";
import enTranslations from "./translations/en.json";

export default {
  ...sectionDef,
  previewImage: "/common/section-previews/custom-html.png",
  previewAlt: "Custom HTML",
  defaultTranslations: {
    en: enTranslations,
  },
};
