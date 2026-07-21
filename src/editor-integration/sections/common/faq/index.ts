import sectionDef from "./section";
// Canonical strings live IN the section folder (portable unit); this preset
// is a thin app-side pointer.
import enTranslations from "@/widgets/common/Faq/i18n/en.json";

export default {
  ...sectionDef,
  previewImage: "/common/section-previews/faq.png",
  previewAlt: "Faq",
  defaultTranslations: {
    en: enTranslations,
  },
};
