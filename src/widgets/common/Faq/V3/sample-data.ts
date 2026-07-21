import type { FaqAnimatedItem } from "./types";
import { SAMPLE_QA, SAMPLE_HEADING } from "../_shared/sample-qa";

/**
 * FaqAnimated (v3) sample content — applied by logic.ts only when the
 * section is unconfigured: "FAQs"-style heading over five closed items
 * (the look's signature resting state; the circled chevrons carry it).
 */
export const V3_SAMPLE_ITEMS: FaqAnimatedItem[] = SAMPLE_QA.map((qa) => ({
  question: qa.question,
  answer: qa.answer,
}));

export const V3_SAMPLE_HEADING = SAMPLE_HEADING;
