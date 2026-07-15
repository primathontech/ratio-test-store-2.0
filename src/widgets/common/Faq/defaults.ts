import type { FaqSharedSettings } from "./contract";
import { SAMPLE_QA, SAMPLE_HEADING } from "./_shared/sample-qa";

/**
 * Default settings for the common Faq widget — in the SHARED contract shape
 * (see contract.ts). logic.ts adapts these onto the selected variant's VM.
 * These values seed the editor preset, so a palette-added FAQ shows real
 * values in the settings sidebar.
 */
export const FaqDefaults: FaqSharedSettings = {
  variant: "v1",
  caption: "",
  heading: SAMPLE_HEADING,
  headingSize: "medium",
  headingColor: "",
  headingAlignment: "default",
  faqs: SAMPLE_QA,
  openFirstRow: false,
  openBehavior: "default",
  iconStyle: "default",
  textSize: "default",
  textCase: "default",
  dividers: true,
  dividerColor: "",
  dividerWidth: 1,
  questionColor: "",
  answerColor: "",
  rowStyle: "default",
  image: { src: "", alt: "" },
  imageRatio: "default",
  imagePosition: "default",
  contentWidth: "default",
  sectionWidth: "default",
  paddingTop: 48,
  paddingBottom: 48,
  colorScheme: "scheme-1",
  sectionBackground: "",
};
