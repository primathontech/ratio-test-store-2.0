import { WidgetProps } from "@/widgets/types";
import { ProductCardProduct } from "@/ui/components/ProductCard/types";

/**
 * Re-export the shared product type for convenience.
 */
export type FeaturedCollectionGridProduct = ProductCardProduct;

/**
 * FeaturedCollectionGrid widget settings
 */
export interface FeaturedCollectionGridSettings {
  /** Widget variant */
  variant?: string;
  /** Category heading text (e.g. "Most Loved", "For Hair Fall Control") */
  categoryTitle?: string;
  /** Collection handle to pick from the API response */
  collectionHandle?: string;
}

/* ------------------------------------------------------------------ */
/*  API Response Types (matching actual collection API response)       */
/* ------------------------------------------------------------------ */

/** Image within a product from the API */
export interface ApiProductImage {
  url: string;
  is_main: boolean;
  alt: string | null;
}

/** Single variant from the API (not an array — one variant per product) */
export interface ApiProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  sku: string;
  barcode: string;
  inventory_quantity: number;
  requires_shipping: boolean;
  weight: string;
  weight_unit: string;
  availableForSale: boolean;
  availableQuantity: number;
  [key: string]: unknown;
}

/** Product metadata fields */
export interface ApiProductMetadata {
  product_labels?: { value: string; data_type: string };
  product_net_content?: { value: string; data_type: string };
  product_subtitle?: { value: string; data_type: string };
  [key: string]: unknown;
}

/** A product as returned by the collection API */
export interface ApiProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  productType: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  tags: string[];
  images: ApiProductImage[];
  product_availability: boolean;
  availableForSale: boolean;
  variant: ApiProductVariant;
  average_rating: number;
  rating_count: number;
  metadata: ApiProductMetadata;
}

/** Inner collection data (nested inside each collection entry) */
export interface ApiCollectionData {
  id: string;
  title: string;
  handle: string;
  description: string;
  image_url: string;
  products: ApiProduct[];
  productPagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  [key: string]: unknown;
}

/** A single collection entry from the API response */
export interface ApiCollectionResult {
  handle: string;
  /** Nested collection data containing products */
  data?: ApiCollectionData;
  /** Fallback: products directly on the entry */
  products?: ApiProduct[];
  success?: boolean;
  message?: string;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * FeaturedCollectionGrid widget data — response from COLLECTION_BY_HANDLES
 */
export interface FeaturedCollectionGridData {
  success?: boolean;
  message?: string;
  data?: ApiCollectionResult[] | null;
  meta?: Record<string, unknown>;
}

/**
 * Props for the FeaturedCollectionGrid component
 */
export type FeaturedCollectionGridProps = WidgetProps<
  FeaturedCollectionGridData,
  FeaturedCollectionGridSettings
>;
