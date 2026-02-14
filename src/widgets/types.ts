import type { Locale } from "@/bootstrap/i18n-config";

/**
 * Base interface for all widget props
 * TData: Type of data the widget receives
 * TSettings: Type of settings the widget accepts
 */
export interface WidgetProps<TData = any, TSettings = any> {
  /** Unique identifier for the widget instance */
  id?: string;

  /** Data to be displayed by the widget */
  data: TData;

  /** Settings options for the widget */
  settings: TSettings;

  /** Optional CSS class name for additional styling */
  className?: string;

  /** Optional locale for i18n support */
  locale?: Locale;
}
