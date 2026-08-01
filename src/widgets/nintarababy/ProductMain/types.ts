import { WidgetProps } from "@/widgets/types";

/**
 * ProductMain widget settings
 */
export interface ProductMainSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Badge text e.g. "Parent's Choice" */
  badgeText?: string;
  /** Save label prefix e.g. "SAVE" */
  saveLabel?: string;
  /** MRP note text */
  mrpNote?: string;
  /** Add to cart button text */
  addToCartText?: string;
  /** Adding (loading) button text */
  addingText?: string;
  /** Out-of-stock button text */
  outOfStockText?: string;
  /** Available offer label */
  offerLabel?: string;
  /** Offers count suffix e.g. "Offer(s)" */
  offersCountSuffix?: string;
  /** Reviews link suffix e.g. "reviews" */
  reviewsText?: string;
  /** Shipping estimate text */
  shippingEstimate?: string;
  /** Default offers array */
  offers?: Offer[];
}

/**
 * A single product image for the gallery
 */
export interface ProductImage {
  /** Image URL */
  url: string;
  /** Alt text for the image */
  alt: string;
  /** Natural width */
  width: number;
  /** Natural height */
  height: number;
}

/**
 * A design/color variant swatch
 */
export interface VariantSwatch {
  /** Variant name e.g. "Lucky Clover" */
  name: string;
  /** Swatch image URL */
  imageUrl: string;
  /** Link to the variant product page */
  href: string;
  /** Whether this is the currently active variant */
  active: boolean;
}

/**
 * A promotional offer
 */
export interface Offer {
  /** Offer code e.g. "TheMomsco10" */
  code: string;
  /** Offer description */
  description: string;
}

/**
 * ProductMain widget data
 */
export interface ProductMainData {
  /** Product title */
  title?: string;
  /** Compare-at price (original) */
  compareAtPrice?: string;
  /** Sale price */
  salePrice?: string;
  /** Save percentage */
  savePercent?: string;
  /** Product gallery images */
  images?: ProductImage[];
  /** Variant swatches */
  variants?: VariantSwatch[];
  /** Active variant name */
  activeVariantName?: string;
  /** Star rating score */
  ratingScore?: string;
  /** Number of reviews */
  reviewCount?: string;
  /** Shipping estimate text */
  shippingEstimate?: string;
  /** Available offers */
  offers?: Offer[];
}

/**
 * Props for the ProductMain component
 */
export type ProductMainProps = WidgetProps<
  ProductMainData,
  ProductMainSettings
>;

/**
 * Design tokens extracted from nintarababy.in ProductMain section
 * Source: https://nintarababy.in/products/ergopod-feeding-pillow-lucky-clover
 * Section: #shopify-section-template--24784210329906__main
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: "#01464f",
    body: "#092a33",
    background: "#ffffff",
    surface: "#f5e9d2",
    muted: "#889093",
    gold: "#c49330",
    badgeParentChoice: "#c6d4f6",
    badgeSave: "#e5c645",
    ratingStar: "#e5c645",
    atcBg: "#01464f",
    atcText: "#ffffff",
    qtyBorder: "#01464f",
    qtyText: "#01464f",
    swatchActiveBorder: "#c49330",
    swatchInactiveBorder: "#e2d5c0",
    thumbActiveBorder: "#c49330",
    arrowBg: "#c49330",
    arrowColor: "#ffffff",
    enlargeBg: "#ffffff",
    enlargeColor: "#01464f",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    h1FontSize: "28px",
    h1FontWeight: "600",
    h1LineHeight: "35px",
    bodyFontSize: "14px",
    priceSaleFontSize: "18px",
    priceCompareFontSize: "16px",
    badgeFontSize: "12px",
    linkFontSize: "16px",
    atcFontSize: "14px",
    qtyFontSize: "16px",
  },
  spacing: {
    containerPaddingDesktop: "0px 80px 30px",
    containerPaddingMobile: "0px 16px 24px",
    rowGutter: "15px",
    thumbSize: "70px",
    thumbColWidth: "80px",
    mainImgAspect: "1 / 1",
    swatchSize: "70px",
    arrowSize: "50px",
    enlargeSize: "44px",
    qtyWidth: "110px",
    qtyHeight: "40px",
    atcHeight: "50px",
    atcMaxWidth: "440px",
  },
  borders: {
    pill: "40px",
    circle: "50%",
    sm: "4px",
    enlargeRadius: "60px",
  },
} as const;

/**
 * Default product images (Lucky Clover)
 */
export const DEFAULT_PRODUCT_IMAGES: ProductImage[] = [
  {
    url: "https://nintarababy.in/cdn/shop/files/1A_1_bd7a26ba-cf35-468e-8cbe-31cba61b48fd.webp?v=1760527981&width=700",
    alt: "Ergopod Baby Feeding Pillow Lucky Clover - front",
    width: 700,
    height: 700,
  },
  {
    url: "https://nintarababy.in/cdn/shop/files/2_1_5148fa66-ac7c-4130-9775-350a45f64527.webp?v=1760527981&width=700",
    alt: "Ergopod Baby Feeding Pillow Lucky Clover - angle",
    width: 700,
    height: 700,
  },
  {
    url: "https://nintarababy.in/cdn/shop/files/3_0141c643-74ba-425f-a359-5fb28cef62af.webp?v=1762235213&width=700",
    alt: "Ergopod Baby Feeding Pillow Lucky Clover - lifestyle",
    width: 700,
    height: 700,
  },
];

/**
 * Default variant swatches
 */
export const DEFAULT_VARIANT_SWATCHES: VariantSwatch[] = [
  {
    name: "Lucky Clover",
    imageUrl:
      "https://nintarababy.in/cdn/shop/files/Lucky_Clover.jpg?v=9873455785932243708",
    href: "/products/ergopod-feeding-pillow-lucky-clover",
    active: true,
  },
  {
    name: "Purple Skies",
    imageUrl:
      "https://nintarababy.in/cdn/shop/files/Purple_Skies.jpg?v=7938823909090962725",
    href: "/products/ergopod-feeding-pillow-purple-skies",
    active: false,
  },
];

/**
 * Default offers
 */
export const DEFAULT_OFFERS: Offer[] = [
  {
    code: "NEW10",
    description: "Flat 10% off to new users",
  },
];
