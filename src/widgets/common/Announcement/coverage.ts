import type { AnnouncementBasicSettings } from "./V1/types";
import type { AnnouncementFadeSettings } from "./V2/types";
import type { AnnouncementTickerSettings } from "./V3/types";

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
  announcements: "shared", // fed from the shared `messages` (title+text joined)
  autoRotate: "shared",
  changeSlidesSpeed: "shared", // fed from the shared `rotationSpeed`
  backgroundColor: "shared",
  textColor: "shared",
  showLineSeparator: "shared", // fed from the shared `dividers`
  dividerColor: "shared",
  dividerWidth: "shared",
  colorScheme: "shared",
  textSize: "shared",
  textAlign: "shared",
  textCase: "shared",
  letterSpacing: "shared",
  showArrows: "shared",
  pauseOnHover: "shared",
  openInNewTab: "shared",
  paddingTop: "shared",
  paddingBottom: "shared",
} satisfies Record<keyof AnnouncementBasicSettings, SettingsCoverage>;

export const V2_COVERAGE = {
  variant: "shared",
  speed: "shared", // fed from the shared `rotationSpeed`
  auto_rotate: "shared", // fed from the shared `autoRotate`
  section_width: "shared",
  color_scheme: "shared",
  divider_width: "shared", // dividers bool → 0; exact px via `dividerWidth`
  "padding-block-start": "shared", // fed from the shared `paddingTop`
  "padding-block-end": "shared", // fed from the shared `paddingBottom`
  announcements: "shared", // fed from the shared `messages` (title bolded)
  background_color: "shared",
  text_color: "shared",
  divider_color: "shared",
  text_size: "shared",
  text_align: "shared",
  text_case: "shared",
  letter_spacing_all: "shared", // fed from the shared `letterSpacing`
  show_arrows: "shared",
  pause_on_hover: "shared",
  open_in_new_tab: "shared",
} satisfies Record<keyof AnnouncementFadeSettings, SettingsCoverage>;

export const V3_COVERAGE = {
  variant: "shared",
  slides: "shared", // fed from the shared `messages` (title→Heading)
  autoplaySeconds: "shared", // fed from the shared `rotationSpeed`
  autoRotate: "shared",
  compactStyle: "shared", // fed from the shared `displayMode`
  sticky: "shared",
  stickyMobile: "shared",
  stickyDesktop: "shared",
  backgroundColor: "shared",
  textColor: "shared",
  borderColor: "shared", // fed from the shared `dividerColor`
  dividerWidth: "shared",
  textSize: "shared",
  textAlign: "shared",
  textCase: "shared",
  letterSpacing: "shared",
  openInNewTab: "shared",
  pauseOnHover: "shared",
  paddingTop: "shared",
  paddingBottom: "shared",
} satisfies Record<keyof AnnouncementTickerSettings, SettingsCoverage>;
