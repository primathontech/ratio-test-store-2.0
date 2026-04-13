import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

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
 * ProductFAQ widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 */
export interface ProductFAQData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the ProductFAQ component
 */
export type ProductFAQProps = WidgetProps<ProductFAQData, ProductFAQSettings>;
