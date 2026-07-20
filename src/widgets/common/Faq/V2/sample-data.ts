import type { FaqAccordionRow } from "./types";
import { SAMPLE_QA, SAMPLE_HEADING } from "../_shared/sample-qa";

/**
 * FaqAccordion (v2) sample content — applied by logic.ts only when the
 * section is unconfigured: centered heading, caret icons, dividers, first
 * row pre-opened so the collapsed list still shows real content.
 */
export const V2_SAMPLE_ROWS: FaqAccordionRow[] = SAMPLE_QA.map((qa, i) => ({
  heading: qa.question,
  body: qa.answer,
  open_by_default: i === 0,
}));

export const V2_SAMPLE_HEADING = SAMPLE_HEADING;
