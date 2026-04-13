import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * A single additional-information block (label + value)
 */
export interface InfoBlock {
  /** The label text (e.g. "MANUFACTURER") */
  label: string;
  /** The value text (may contain \n for line breaks) */
  value: string;
}

/**
 * A single content block for the SEO prose accordion (V2).
 * Supports headings, paragraphs, and ordered/unordered lists.
 */
export interface ProseBlock {
  /** Block type */
  type: "h1" | "h2" | "h3" | "p" | "ol" | "ul";
  /** Text content (for h1/h2/h3/p). May include inline markup via segments. */
  text?: string;
  /** List items (for ol/ul). Each item is a string. */
  items?: string[];
}

/**
 * AdditionalInformation widget settings
 */
export interface AdditionalInformationSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading text */
  title?: string;
  /** Info blocks to display in the expanded grid (V1) */
  items?: InfoBlock[];
  /** Whether the accordion starts expanded */
  defaultExpanded?: boolean;
  /** Structured prose content blocks for SEO accordion (V2) */
  proseBlocks?: ProseBlock[];
}

/**
 * AdditionalInformation widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 */
export interface AdditionalInformationData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the AdditionalInformation component
 */
export type AdditionalInformationProps = WidgetProps<
  AdditionalInformationData,
  AdditionalInformationSettings
>;
