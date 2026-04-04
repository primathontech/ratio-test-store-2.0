import { WidgetProps } from "@/widgets/types";

/**
 * A single content block: heading + paragraph
 */
export interface AboutUsStoryBlock {
  /** Section heading text */
  heading: string;
  /** Paragraph body text */
  body: string;
}

/**
 * AboutUsStory widget settings
 */
export interface AboutUsStorySettings {
  /** Widget variant */
  variant?: string;
  /** Content blocks: heading + body pairs */
  blocks?: AboutUsStoryBlock[];
  /** Text color for headings and body */
  textColor?: string;
  /** SVG divider color */
  dividerColor?: string;
}

/**
 * AboutUsStory widget data (static section, no API data needed)
 */
export interface AboutUsStoryData {
  // Static content section -- no dynamic data
}

/**
 * Props for the AboutUsStory component
 */
export type AboutUsStoryProps = WidgetProps<
  AboutUsStoryData,
  AboutUsStorySettings
>;
