import sectionDef from "./section";
// Canonical strings live IN the section folder (portable unit); this preset
// is a thin app-side pointer.
import enTranslations from "@/widgets/common/Hero/i18n/en.json";

export default {
  ...sectionDef,
  previewImage: "/common/section-previews/hero.png",
  previewAlt: "Hero",
  defaultTranslations: {
    en: enTranslations,
  },
};
