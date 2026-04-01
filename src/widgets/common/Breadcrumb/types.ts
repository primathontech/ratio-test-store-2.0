import { WidgetProps } from "@/widgets/types";

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
 * Breadcrumb widget data (static section, no API data needed)
 */
export interface BreadcrumbData {
  // Static content section -- no dynamic data
}

/**
 * Props for the Breadcrumb component
 */
export type BreadcrumbProps = WidgetProps<BreadcrumbData, BreadcrumbSettings>;
