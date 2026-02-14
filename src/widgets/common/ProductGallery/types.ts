import { WidgetProps } from "@/widgets/types";
import { Dispatch, SetStateAction } from "react";

/**
 * ProductGallery widget settings
 */
export interface ProductGallerySettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
  images?: any[];
  [key: string]: any;
}

/**
 * ProductGallery widget data
 */
export interface ProductGalleryData {
  images?: any[];
  [key: string]: any;
}

/**
 * Product label type
 */
export interface ProductLabel {
  key: string;
  label: string;
  background: string;
}

/**
 * Props for the ProductGallery component
 */
export interface ProductGalleryProps
  extends WidgetProps<ProductGalleryData, ProductGallerySettings> {
  /** Product label to display on gallery */
  productLabel?: ProductLabel;
  /** Callback when hover preview state changes */
  onHoverPreviewChange?: Dispatch<SetStateAction<boolean>>;
}
