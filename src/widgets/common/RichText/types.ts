import { WidgetProps } from "@/widgets/types";

/**
 * RichText widget settings
 */
export interface RichTextSettings {
  /** Widget variant. @default 'v1' */
  variant?: string;
  /** Rich-text HTML body (from the visual editor). */
  body?: string;
}

/**
 * RichText widget data — none (static content widget)
 */
export interface RichTextData {}

/**
 * Props for the RichText component
 */
export type RichTextProps = WidgetProps<RichTextData, RichTextSettings>;
