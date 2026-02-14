import { WidgetProps } from "../../types";

/**
 * Configuration options for the ProductInfo widget
 */
export interface ReasonToLoveSectionSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * Widget variant
   * @default 'Reasons to Love'
   */
  sectionTitle: string;
}

export type ReasonToLoveSectionProps = WidgetProps<
  any,
  ReasonToLoveSectionSettings
>;
