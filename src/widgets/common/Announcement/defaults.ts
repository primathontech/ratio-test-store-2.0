import type { AnnouncementSharedSettings } from "./contract";
import { SAMPLE_MESSAGES } from "./_shared/sample-messages";

/**
 * Default settings for the common Announcement widget — in the SHARED
 * contract shape (see contract.ts). logic.ts adapts these onto the selected
 * variant's VM. These values seed the editor preset, so a palette-added
 * Announcement shows real values in the settings sidebar.
 */
export const AnnouncementDefaults: AnnouncementSharedSettings = {
  variant: "v1",
  messages: SAMPLE_MESSAGES,
  openInNewTab: false,
  autoRotate: true,
  rotationSpeed: 5,
  pauseOnHover: "default",
  showArrows: true,
  arrowPosition: "default",
  messageLayout: "default",
  displayMode: "default",
  textSize: "default",
  textAlign: "default",
  textCase: "default",
  letterSpacing: "default",
  sectionWidth: "default",
  sticky: false,
  stickyMobile: false,
  stickyDesktop: true,
  colorScheme: "scheme-1",
  backgroundColor: "",
  textColor: "",
  dividers: true,
  dividerColor: "",
  dividerWidth: 1,
  paddingTop: 15,
  paddingBottom: 15,
};
