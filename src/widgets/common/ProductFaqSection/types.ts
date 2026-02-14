import { WidgetProps } from "../../types";
import { FAQSettings } from "../../common/FAQ/types";

/**
 * Configuration options for the ProductFaqSection widget
 * Extends the common FAQ settings with product-specific options
 */
export interface ProductFaqSectionSettings extends Omit<FAQSettings, "items"> {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  faq?: Partial<FAQSettings>;
}

export type ProductFaqSectionProps = WidgetProps<
  any,
  ProductFaqSectionSettings
>;
