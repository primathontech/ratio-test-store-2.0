import { WidgetProps } from "../../types";

/**
 * Configuration options for the ProductInfo widget
 */
export interface ProductAdditionalInfoSectionSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * Widget variant
   * @default 'Disclaimer'
   */
  sectionTitle: string;

  /**
   * Widget variant
   * @default 'Disclaimer'
   */
  marketedBy?: string;

  /**
   * Widget variant
   * @default 'Disclaimer'
   */
  countryOfOrigin?: string;

  /**
   * Widget variant
   * @default 'Disclaimer'
   */
  customerCareDetails?: string;
}

export type ProductAdditionalInfoSectionProps = WidgetProps<
  any,
  ProductAdditionalInfoSectionSettings
>;
