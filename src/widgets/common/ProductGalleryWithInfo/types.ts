import { WidgetProps } from "../../types";
import { ProductGallerySettings } from "../../common/ProductGallery/types";

/**
 * Settings for ProductGalleryWithInfo widget
 * Combines settings from both ProductGallery and ProductInfo
 */
export interface ProductGalleryWithInfoSettings {
  variant?: "v1";

  // ProductGallery settings - all optional to allow passing through
  productGallery?: Partial<ProductGallerySettings>;

  // View All button
  /**
   * view all button text
   * @default 'Add to Cart'
   */
  addToCartText?: string;

  // Net content
  netContentText?: string;

  //Inclusive of all taxes
  inclusiveOfAllTaxesText?: string;

  //Reviews
  reviewsText?: string;

  // MRP
  mrp?: string;

  //discount
  discount?: string;

  //usp
  usp?: string;

  //rupee
  rupeeSymbol?: string;

  //select size tecxt
  selectSizeText?: string;

  //sold out text
  soldOutText?: string;

  // Responsive settings
  responsive?: {
    mobile?: {
      /** Stack vertically on mobile */
      stackVertically?: boolean;
    };
  };
}

export type ProductGalleryWithInfoProps = WidgetProps<
  any,
  ProductGalleryWithInfoSettings
>;
