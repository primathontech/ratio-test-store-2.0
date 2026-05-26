import { WidgetProps } from "@/widgets/types";

/**
 * CustomHtml widget settings
 */
export interface CustomHtmlSettings {
  /** Widget variant. @default 'v1' */
  variant?: string;
  /** Rich-text HTML body (from the visual editor). */
  body?: string;
}

/**
 * CustomHtml widget data — none (static content widget)
 */
export interface CustomHtmlData {}

/**
 * Props for the CustomHtml component
 */
export type CustomHtmlProps = WidgetProps<CustomHtmlData, CustomHtmlSettings>;
