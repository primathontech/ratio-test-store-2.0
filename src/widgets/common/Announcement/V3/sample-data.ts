import type { AnnouncementTickerSlide } from "./types";
import { SAMPLE_MESSAGES } from "../_shared/sample-messages";

/**
 * AnnouncementTicker (v3) sample content — applied by logic.ts only when the
 * section is unconfigured. Two-part slides (bold uppercase lead + text) — the
 * look's signature shape.
 */
export const V3_SAMPLE_SLIDES: AnnouncementTickerSlide[] = SAMPLE_MESSAGES.map(
  (m) => ({ Heading: m.title, Text: m.text, Link: m.link })
);
