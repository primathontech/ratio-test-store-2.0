import { WidgetProps } from "@/widgets/types";

/**
 * CollectionWidget widget settings
 */
export interface CollectionWidgetSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
}

/**
 * CollectionWidget widget data
 */
export interface CollectionWidgetData {
  // Define the data structure your widget receives from dataSources
}

/**
 * Props for the CollectionWidget component
 */
export type CollectionWidgetProps = WidgetProps<CollectionWidgetData, CollectionWidgetSettings>;
