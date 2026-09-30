import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * A single breadcrumb link item
 */
export interface BreadcrumbItem {
  /** Display text */
  text: string;
  /** Link URL (omit for current page / non-link) */
  href?: string;
}

/**
 * Breadcrumb widget settings
 */
export interface BreadcrumbSettings {
  /** Widget variant */
  variant?: string;
  /** Breadcrumb items (last item treated as current page -- rendered bold, no link) */
  items?: BreadcrumbItem[];
}

/**
 * Breadcrumb widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 */
export interface BreadcrumbData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the Breadcrumb component
 */
export type BreadcrumbProps = WidgetProps<BreadcrumbData, BreadcrumbSettings>;
