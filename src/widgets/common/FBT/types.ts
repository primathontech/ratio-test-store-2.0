import { WidgetProps } from "@/widgets/types";

/**
 * Inner product payload — only the fields FBT cares about. The SDK
 * itself fetches the full bundle data, so all we need to forward is
 * the product id.
 */
export interface FBTProductData {
  id?: string | number;
}

/**
 * Standard data-aggregator envelope that ratio.0 emits for
 * `dataSourceKey: "productData"`. Mirrors what ProductDetail/V1
 * consumes (`data?.success ? data.data : null`).
 */
export interface FBTProductResponse {
  success?: boolean;
  message?: string;
  data?: FBTProductData | null;
  error?: unknown;
  meta?: Record<string, unknown>;
}

export type FBTData = FBTProductData | FBTProductResponse;

/** FBT widget settings */
export interface FBTSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading (optional, controlled by SDK). */
  title?: string;
}

/** Props for the FBT component */
export type FBTProps = WidgetProps<FBTData, FBTSettings>;
