import { WidgetProps } from "@/widgets/types";

export interface ProductBundleData {
  /** Optional bundle id passed from data source */
  bundleId?: string;
}

export interface ProductBundleSettings {
  /** Optional variant selector (defaults to v1) */
  variant?: string;
  /** Explicit bundle id; falls back to data or URL param */
  bundleId?: string;
  /** Optional heading text shown above the bundler */
  heading?: string;
  /** Optional helper copy shown under the heading */
  subheading?: string;
  /** Override the bundler script URL (defaults to NEXT_PUBLIC_SDK_URL) */
  scriptUrl?: string;
}

export type ProductBundleProps = WidgetProps<
  ProductBundleData,
  ProductBundleSettings
>;
