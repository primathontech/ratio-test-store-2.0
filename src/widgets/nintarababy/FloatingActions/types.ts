import { WidgetProps } from "@/widgets/types";

/**
 * FloatingActions widget settings
 */
export interface FloatingActionsSettings {
  /** Widget variant @default "v1" */
  variant?: string;
}

/**
 * FloatingActions widget data
 */
export interface FloatingActionsData {
  /** WhatsApp phone number */
  whatsappNumber?: string;
  /** Scroll threshold in pixels before showing scroll-to-top */
  scrollThreshold?: number;
}

/**
 * Props for the FloatingActions component
 */
export type FloatingActionsProps = WidgetProps<
  FloatingActionsData,
  FloatingActionsSettings
>;
