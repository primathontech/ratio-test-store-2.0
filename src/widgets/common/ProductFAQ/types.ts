import { WidgetProps } from "@/widgets/types";

/**
 * A single FAQ item with question and answer
 */
export interface FAQItem {
  /** The question text */
  question: string;
  /** The answer text */
  answer: string;
}

/**
 * ProductFAQ widget settings
 */
export interface ProductFAQSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading text */
  title?: string;
  /** FAQ items array */
  items?: FAQItem[];
  /** Whether the outer accordion starts expanded */
  defaultExpanded?: boolean;
}

/**
 * ProductFAQ widget data (static section, no API data needed)
 */
export interface ProductFAQData {
  // Static content section -- no dynamic data
}

/**
 * Props for the ProductFAQ component
 */
export type ProductFAQProps = WidgetProps<ProductFAQData, ProductFAQSettings>;
