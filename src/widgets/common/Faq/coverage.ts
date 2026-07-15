import type { FaqCollapsibleSettings } from "./V1/types";
import type { FaqAccordionSettings } from "./V2/types";
import type { FaqAnimatedSettings } from "./V3/types";

/**
 * Settings-coverage maps — the COMPILER-ENFORCED parity gate.
 *
 * Every variant-native settings key is classified:
 *   - "shared":      fed from a shared contract field (logic.ts maps it)
 *   - "passthrough": native-only; reachable via raw-settings passthrough
 *   - "generated":   computed by logic.ts, not merchant-set
 *
 * The `satisfies Record<keyof …>` declarations make tsc name the exact
 * missing key the moment a variant gains an unclassified setting.
 */
export type SettingsCoverage = "shared" | "passthrough" | "generated";

export const V1_COVERAGE = {
  variant: "shared",
  caption: "shared",
  heading: "shared",
  headingSize: "shared",
  headingAlignment: "shared",
  headingColor: "shared",
  rows: "shared", // fed from the shared `faqs` items
  openFirstRow: "shared",
  layout: "shared", // fed from the shared `rowStyle`
  questionColor: "shared",
  answerColor: "shared",
  dividerColor: "shared",
  image: "shared",
  imageAlt: "shared", // the shared image field's alt
  imageRatio: "shared",
  imagePosition: "shared",
  colorScheme: "shared",
  sectionBackground: "shared",
  paddingTop: "shared",
  paddingBottom: "shared",
} satisfies Record<keyof FaqCollapsibleSettings, SettingsCoverage>;

export const V2_COVERAGE = {
  variant: "shared",
  color_scheme: "shared",
  section_width: "shared",
  gap: "passthrough", // heading↔accordion gap — no shared field (uses the look's 24px)
  "padding-block-start": "shared", // fed from the shared `paddingTop`
  "padding-block-end": "shared", // fed from the shared `paddingBottom`
  section_background: "shared",
  caption: "shared",
  heading: "shared",
  heading_preset: "shared", // fed from the shared `headingSize`
  heading_alignment: "shared",
  heading_color: "shared",
  icon: "shared", // fed from the shared `iconStyle`
  dividers: "shared",
  divider_color: "shared",
  row_preset: "passthrough", // per-row title preset — no shared field (uses H6)
  rows: "shared", // fed from the shared `faqs` items (+ openFirstRow)
  question_color: "shared",
  answer_color: "shared",
} satisfies Record<keyof FaqAccordionSettings, SettingsCoverage>;

export const V3_COVERAGE = {
  variant: "shared",
  heading: "shared",
  headingSize: "shared",
  faqs: "shared",
  caption: "shared",
  headingAlignment: "shared",
  headingColor: "shared",
  questionColor: "shared",
  answerColor: "shared",
  dividerColor: "shared",
  sectionBackground: "shared",
  colorScheme: "shared",
  openFirstRow: "shared",
  paddingTop: "shared",
  paddingBottom: "shared",
} satisfies Record<keyof FaqAnimatedSettings, SettingsCoverage>;
