import { WidgetProps } from "@/widgets/types";

/**
 * PageContent widget settings
 */
export interface PageContentSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
}

/**
 * PageContent widget data
 */
export interface PageContentData {
  // Define the data structure your widget receives from dataSources
}

/**
 * Props for the PageContent component
 */
export type PageContentProps = WidgetProps<
  PageContentData,
  PageContentSettings
>;
