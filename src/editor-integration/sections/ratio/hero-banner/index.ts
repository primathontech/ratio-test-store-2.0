import sectionDef from "./section";
import enTranslations from "./translations/en.json";

export default {
  ...sectionDef,
  previewImage: "/ratio/section-previews/hero-banner.png",
  previewAlt: "Hero Banner",
  defaultTranslations: {
    en: enTranslations,
  },
};
