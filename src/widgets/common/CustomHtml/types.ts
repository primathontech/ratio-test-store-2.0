import { WidgetProps } from "@/widgets/types";

/**
 * CustomHtml widget settings
 */
export interface CustomHtmlSettings {
  /**
   * Raw HTML content to render.
   */
  html?: string;

  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
}

/**
 * CustomHtml widget data
 */
export interface CustomHtmlData {
  // Define the data structure your widget receives from dataSources
}

/**
 * Props for the CustomHtml component
 */
export type CustomHtmlProps = WidgetProps<CustomHtmlData, CustomHtmlSettings>;
