import { WidgetProps } from "@/widgets/types";

/**
 * ProductInfo widget settings
 */
export interface ProductInfoSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
}

/**
 * ProductInfo widget data
 */
export interface ProductInfoData {
  // Define the data structure your widget receives from dataSources
}

/**
 * Props for the ProductInfo component
 */
export type ProductInfoProps = WidgetProps<ProductInfoData, ProductInfoSettings>;
