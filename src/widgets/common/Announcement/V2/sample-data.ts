import type { AnnouncementFadeItem } from "./types";
import { SAMPLE_MESSAGES } from "../_shared/sample-messages";

/**
 * AnnouncementFade (v2) sample content — applied by logic.ts only when the
 * section is unconfigured. Rich-text single-line messages (lead bolded via
 * inline markup — the look's signature typography surface).
 */
export const V2_SAMPLE_ITEMS: AnnouncementFadeItem[] = SAMPLE_MESSAGES.map(
  (m, i) => ({
    id: `sample-${i}`,
    text: `<strong>${m.title}</strong> — ${m.text}`,
    link: m.link,
  })
);
