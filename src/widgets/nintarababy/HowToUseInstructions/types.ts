import { WidgetProps } from "@/widgets/types";

/**
 * HowToUseInstructions widget settings
 */
export interface HowToUseInstructionsSettings {
  /** Widget variant @default "v1" */
  variant?: string;
}

/**
 * A single instruction step
 */
export interface InstructionStep {
  /** Unique ID */
  id: number;
  /** Step text description */
  text: string;
}

/**
 * HowToUseInstructions widget data
 */
export interface HowToUseInstructionsData {
  /** Section heading */
  heading?: string;
  /** Array of instruction steps */
  steps?: InstructionStep[];
}

/**
 * Combined props for the HowToUseInstructions widget
 */
export type HowToUseInstructionsProps = WidgetProps<
  HowToUseInstructionsData,
  HowToUseInstructionsSettings
>;

/**
 * Default heading text
 */
export const DEFAULT_HEADING = "How to Use";

/**
 * Default instruction steps
 */
export const DEFAULT_STEPS: InstructionStep[] = [
  {
    id: 1,
    text: "Place the Ergopod Feeding Pillow- Lucky Clover around your waist with the lumbar panel centred at your lower back and the clasp on your right side.",
  },
  {
    id: 2,
    text: "Use the velcro strap to adjust the fit. Clip the silent-release buckle to prevent shifting and ensure a comfortable fit.",
  },
  {
    id: 3,
    text: "Sit upright with both feet supported. Lean into the built-in lumbar panel so your spine stays neutral. Keep shoulders relaxed.",
  },
  {
    id: 4,
    text: "Lay your baby on the pillow. Use your forearm to support the baby\u2019s shoulders and neck.",
  },
  {
    id: 5,
    text: "When done feeding, press the silent buckle to remove the pillow without disturbance. Store it in a clean, dry place.",
  },
  {
    id: 6,
    text: "Unzip the cotton cover and machine wash as per the care label. Wipe the inner waterproof lining if needed.",
  },
];

/**
 * Image paths for the widget (relative to /public)
 */
export const IMAGE_PATHS = {
  bulletIcon: "/nintarababy/HowToUseInstructions/images/bullet-icon.png",
  desktopImage:
    "/nintarababy/HowToUseInstructions/images/how-to-use-desktop.webp",
  mobileImage:
    "/nintarababy/HowToUseInstructions/images/how-to-use-mobile.webp",
  mobileBg:
    "/nintarababy/HowToUseInstructions/images/safety-instructions-bg.png",
};
