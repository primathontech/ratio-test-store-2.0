import { WidgetProps } from "@/widgets/types";

/**
 * A single FAQ item with question and answer
 */
export interface FaqItem {
  /** The question text */
  question: string;
  /** The answer text (may contain HTML) */
  answer: string;
}

/**
 * FaqAccordion widget settings
 */
export interface FaqAccordionSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading text */
  title?: string;
  /** FAQ items array */
  items?: FaqItem[];
}

/**
 * FaqAccordion widget data (static section, no API data needed)
 */
export interface FaqAccordionData {
  // Static content section -- no dynamic data
}

/**
 * Props for the FaqAccordion component
 */
export type FaqAccordionProps = WidgetProps<
  FaqAccordionData,
  FaqAccordionSettings
>;
