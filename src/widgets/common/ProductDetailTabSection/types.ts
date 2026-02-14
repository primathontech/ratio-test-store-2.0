import { WidgetProps } from "../../types";

/**
 * Configuration options for the ProductInfo widget
 */
export interface ProductInfoSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
}

export type ProductDetailTabSectionProps = WidgetProps<
  any,
  ProductInfoSettings
>;
