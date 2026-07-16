import type { AnnouncementBasicMessage } from "./types";
import { SAMPLE_MESSAGES } from "../_shared/sample-messages";

/**
 * AnnouncementBasic (v1) sample content — applied by logic.ts only when the
 * section is unconfigured. Single-part messages: title + text joined, so the
 * minimal look reads as one clean line.
 */
export const V1_SAMPLE_MESSAGES: AnnouncementBasicMessage[] =
  SAMPLE_MESSAGES.map((m) => ({
    text: [m.title, m.text].filter(Boolean).join(" — "),
    link: m.link,
  }));
