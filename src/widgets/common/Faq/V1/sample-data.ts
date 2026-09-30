import type { FaqCollapsibleRow } from "./types";
import {
  SAMPLE_QA,
  SAMPLE_HEADING,
  SAMPLE_CAPTION,
} from "../_shared/sample-qa";

/**
 * FaqCollapsible (v1) sample content — applied by logic.ts only when the
 * section is unconfigured, so a fresh palette add renders the look's
 * signature state: caption + centered heading over a narrow hairline list.
 */
export const V1_SAMPLE_ROWS: FaqCollapsibleRow[] = SAMPLE_QA.slice(0, 4).map(
  (qa) => ({ title: qa.question, body: qa.answer })
);

export const V1_SAMPLE_HEADING = SAMPLE_HEADING;
export const V1_SAMPLE_CAPTION = SAMPLE_CAPTION;
