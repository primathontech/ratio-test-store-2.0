import sectionDef from "./section";
// Canonical strings live IN the section folder (portable unit); this preset
// is a thin app-side pointer.
import enTranslations from "@/widgets/common/Announcement/i18n/en.json";

export default {
  ...sectionDef,
  previewImage: "/common/section-previews/announcement.png",
  previewAlt: "Announcement",
  defaultTranslations: {
    en: enTranslations,
  },
};
