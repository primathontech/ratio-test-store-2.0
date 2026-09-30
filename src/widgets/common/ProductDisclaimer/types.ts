import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * ProductDisclaimer widget settings
 */
export interface ProductDisclaimerSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading text */
  sectionTitle?: string;
  /** Alias for sectionTitle */
  title?: string;
  /** Disclaimer items (fallback when API has no `disclaimer` metadata) */
  items?: string[];
}

/**
 * ProductDisclaimer widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 */
export interface ProductDisclaimerData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the ProductDisclaimer component
 */
export type ProductDisclaimerProps = WidgetProps<
  ProductDisclaimerData,
  ProductDisclaimerSettings
>;
