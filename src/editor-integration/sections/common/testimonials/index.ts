import sectionDef from "./section";
import enTranslations from "./translations/en.json";

export default {
  ...sectionDef,
  previewImage: "/common/section-previews/testimonials.png",
  previewAlt: "Testimonials",
  defaultTranslations: {
    en: enTranslations,
  },
};
