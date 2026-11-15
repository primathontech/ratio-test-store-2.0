import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * ReasonsToLove widget settings
 */
export interface ReasonsToLoveSettings {
  /** Widget variant */
  variant?: string;

  /** Section heading text */
  sectionTitle?: string;
}

/**
 * ReasonsToLove widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 */
export interface ReasonsToLoveData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the ReasonsToLove component
 */
export type ReasonsToLoveProps = WidgetProps<
  ReasonsToLoveData,
  ReasonsToLoveSettings
>;
