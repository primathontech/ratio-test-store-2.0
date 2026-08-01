import { WidgetProps } from "@/widgets/types";

export interface AboutUsSettings {
  variant?: string;
  title?: string;
  backgroundColor?: string;
  heroDesktopImage?: string;
  heroMobileImage?: string;
  heroAlt?: string;
  block1Image?: string;
  block1Heading?: string;
  block1Text?: string;
  block2Image?: string;
  block2Heading?: string;
  block2Text?: string;
  block3Image?: string;
  block3Heading?: string;
  block3Text?: string;
}

export type AboutUsProps = WidgetProps<Record<string, never>, AboutUsSettings>;
