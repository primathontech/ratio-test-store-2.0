export interface WidgetProps<TData = unknown, TSettings = unknown> {
  data?: TData;
  settings?: TSettings;
  className?: string;
  locale?: string;
}
