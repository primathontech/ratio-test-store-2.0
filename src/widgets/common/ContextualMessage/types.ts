import { WidgetProps } from "@/widgets/types";
import { VariantType } from "./variants";

/** Settings for ContextualMessage widget */
export interface Settings {
  variant: VariantType;

  // Responsive behavior
  showBelowWidth?: number; // Default: 768px (mobile only)
  hideContextualMessage?: boolean; // When true, component is not rendered

  // Positioning
  bottomOffset?: number; // Default: 70 (in pixels)

  // Styling
  className?: string; // Additional CSS classes
  height?: number; // Default: 30 (in pixels)
}

/**
 * ContextualMessage widget data - no additional data needed
 * All data comes from cart store and environment variables
 */
export interface Data {
  // No additional data needed - uses cart context
}

export type Props = WidgetProps<Data, Settings>;
