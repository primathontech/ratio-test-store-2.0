import { WidgetProps } from "@/widgets/types";

/**
 * MobileBottomBar widget settings
 */
export interface MobileBottomBarSettings {
  /** Widget variant @default "v1" */
  variant?: string;
}

/**
 * MobileBottomBar widget data
 */
export interface MobileBottomBarData {
  /** Navigation items override */
  items?: Array<{
    label: string;
    href: string;
    icon?: string;
  }>;
}

/**
 * Props for the MobileBottomBar component
 */
export type MobileBottomBarProps = WidgetProps<
  MobileBottomBarData,
  MobileBottomBarSettings
>;
