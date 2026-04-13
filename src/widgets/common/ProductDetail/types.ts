import { WidgetProps } from "@/widgets/types";

/* ------------------------------------------------------------------ */
/*  Enums                                                              */
/* ------------------------------------------------------------------ */

/** Keys used to access product metadata fields from the API */
export enum ProductMetadataKey {
  BEST_BEFORE = "best_before",
  DIMENSIONS = "dimensions",
  DISCLAIMER = "disclaimer",
  GENERIC_NAME = "generic_name",
  LICENSE_NUMBER = "license_number",
  MANUFACTURER = "manufacturer",
  OLD_PRICE = "old_price",
  PRODUCT_LABELS = "product_labels",
  PRODUCT_NET_CONTENT = "product_net_content",
  PRODUCT_SUBTITLE = "product_subtitle",
  REASONS_TO_LOVE_IMAGE = "reasons_to_love_image",
  TRUST_BADGES = "trust_badges",
  WHAT_IT_DOES = "what_it_does",
  RATING = "rating",
  RATING_COUNT = "rating_count",
  PRODUCT_FAQ = "product_faq",
  PRODUCT_DETAILS = "product_details",
}

/** Content type for product detail tabs */
export enum ProductTabType {
  HTML = "html",
  STEPS = "steps",
  INGREDIENTS = "ingredients",
  LIST = "list",
  INGREDIENTS_LIST = "ingredientsList",
}

/** Handle prefixes for product detail tab type detection */
export enum ProductTabHandlePrefix {
  HOW_TO_USE = "how-to-use",
  HERO_INGREDIENT = "hero-ingredient",
  SUITABLE_FOR = "suitable-for",
  INGREDIENTS_LIST = "ingredients-list",
}

/** Sort options for reviews API */
export enum ReviewSortBy {
  NEWEST = "newest",
  HIGHEST = "highest",
  LOWEST = "lowest",
}

/** User types returned by reviews API */
export enum ReviewUserType {
  CUSTOMER = "customer",
}

/** Product status from the API */
export enum ProductStatus {
  ACTIVE = "active",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

/** Image media type from the API */
export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

/* ------------------------------------------------------------------ */
/*  API Response Types (from DATA_SOURCE_TYPES.PRODUCT)                */
/* ------------------------------------------------------------------ */

/** Product image from the API */
export interface ApiProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_main: boolean;
  position: number;
  media_type: string;
  thumbnail_url: string | null;
}

/** Product variant from the API */
export interface ApiProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  sku: string;
  barcode: string;
  inventory_quantity: number;
  imageUrl: string;
  presentment_prices: {
    price: { amount: number; currency_code: string };
    compare_at_price: number | null;
  }[];
  option_values: string[];
  metadata: Record<string, unknown>;
  availableForSale: boolean;
  availableQuantity: number;
}

/** Product option from the API */
export interface ApiProductOption {
  id: string;
  name: string;
  position: number;
  isGroupedBy: boolean;
  values: {
    id: string;
    value: string;
    position: number;
  }[];
}

/** Product tag from the API */
export interface ApiProductTag {
  id: string;
  name: string;
}

/** Metadata field value */
export interface ApiMetadataField {
  value: unknown;
  data_type: string;
}

/** FAQ card from product_faq metadata */
export interface ApiProductFaqCard {
  id: string;
  type: string;
  handle: string;
  status: string;
  fields: {
    title: { value: string[]; data_type: string };
    description: { value: string; data_type: string };
  };
}

/** Product detail card from product_details metadata */
export interface ApiProductDetailCard {
  id: string;
  type: string;
  handle: string;
  status: string;
  fields: {
    title: { value: string[]; data_type: string };
    content: { value: string[]; data_type: string };
    image: { value: string[]; data_type: string };
  };
}

/** Product detail tab from product_details metadata */
export interface ApiProductDetailTab {
  id: string;
  type: string;
  handle: string;
  status: string;
  fields: {
    tab_title: { value: string[]; data_type: string };
    tab_content: { value: ApiProductDetailCard[]; data_type: string };
  };
}

/** Product metadata from the API */
export interface ApiProductMetadata {
  [ProductMetadataKey.BEST_BEFORE]?: ApiMetadataField;
  [ProductMetadataKey.DIMENSIONS]?: ApiMetadataField;
  [ProductMetadataKey.DISCLAIMER]?: { value: string[]; data_type: string };
  [ProductMetadataKey.GENERIC_NAME]?: ApiMetadataField;
  [ProductMetadataKey.LICENSE_NUMBER]?: ApiMetadataField;
  [ProductMetadataKey.MANUFACTURER]?: ApiMetadataField;
  [ProductMetadataKey.OLD_PRICE]?: ApiMetadataField;
  [ProductMetadataKey.PRODUCT_LABELS]?: ApiMetadataField;
  [ProductMetadataKey.PRODUCT_NET_CONTENT]?: ApiMetadataField;
  [ProductMetadataKey.PRODUCT_SUBTITLE]?: ApiMetadataField;
  [ProductMetadataKey.REASONS_TO_LOVE_IMAGE]?: {
    value: string[];
    data_type: string;
  };
  [ProductMetadataKey.TRUST_BADGES]?: { value: string[]; data_type: string };
  [ProductMetadataKey.WHAT_IT_DOES]?: { value: string[]; data_type: string };
  [ProductMetadataKey.RATING]?: ApiMetadataField;
  [ProductMetadataKey.RATING_COUNT]?: ApiMetadataField;
  [ProductMetadataKey.PRODUCT_FAQ]?: {
    value: ApiProductFaqCard[];
    data_type: string;
  };
  [ProductMetadataKey.PRODUCT_DETAILS]?: {
    value: ApiProductDetailTab[];
    data_type: string;
  };
  [key: string]: unknown;
}

/** Full product object from the API */
export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  product_type: string;
  vendor: string;
  price: number;
  compare_at_price: number | null;
  status: string;
  image: ApiProductImage;
  images: ApiProductImage[];
  categoryMetafields: unknown;
  options: ApiProductOption[];
  variants: ApiProductVariant[];
  availableForSale: boolean;
  tags: ApiProductTag[];
  metadata: ApiProductMetadata;
  seo_title: string;
  seo_description: string;
  seo_url_handle: string;
}

/* ------------------------------------------------------------------ */
/*  Widget-specific Types                                              */
/* ------------------------------------------------------------------ */

/**
 * A product image in the gallery
 */
export interface ProductImage {
  src: string;
  alt: string;
  isVideo?: boolean;
  videoThumbnail?: string;
}

/**
 * A product variant/shade option
 */
export interface ProductVariant {
  name: string;
  price: string;
  unitPrice?: string;
  href: string;
  swatchImage: string;
  isActive?: boolean;
}

/**
 * A product benefit badge
 */
export interface ProductBenefit {
  text: string;
}

/**
 * ProductDetail widget settings
 */
export interface ProductDetailSettings {
  /** Widget variant */
  variant?: string;

  /** Product title */
  title?: string;

  /** Star rating value (e.g., "5.0") */
  rating?: string;

  /** Number of reviews */
  reviewCount?: string;

  /** Product benefits displayed as badges with checkmarks */
  benefits?: ProductBenefit[];

  /** Net content string (e.g., "130g (USP: ...3.07/g)") */
  netContent?: string;

  /** Net content label */
  netContentLabel?: string;

  /** Price label (e.g., "M.R.P.") */
  priceLabel?: string;

  /** Price value (e.g., "...399") */
  price?: string;

  /** Original price before discount */
  originalPrice?: string;

  /** Tax info text (e.g., "Incl. of all taxes") */
  taxInfo?: string;

  /** Variant selector label (e.g., "Select variant") */
  variantLabel?: string;

  /** Product variants/shades */
  variants?: ProductVariant[];

  /** Add to cart button text */
  addToCartText?: string;

  /** Product images for the gallery */
  images?: ProductImage[];

  /** Badge text on top of image (e.g., "Get3@...799") */
  badgeText?: string;
}

/**
 * ProductDetail widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 */
export interface ProductDetailData {
  success?: boolean;
  message?: string;
  data?: ApiProduct | null;
  meta?: unknown;
}

/**
 * Props for the ProductDetail component
 */
export type ProductDetailProps = WidgetProps<
  ProductDetailData,
  ProductDetailSettings
>;
