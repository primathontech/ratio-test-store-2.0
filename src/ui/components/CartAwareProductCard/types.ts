/**
 * Permissive API-product shape consumed by `toCardProduct` and `toCartItem`.
 *
 * The shape covers BOTH:
 *   - `ApiProduct` from `FeaturedCollectionGrid/types.ts` (list/grid/carousel)
 *   - `ApiRecentProduct` from `RecentlyViewed/utils/index.ts` (product detail)
 *
 * Fields are optional so the union of both shapes is structurally assignable.
 * Mappers handle missing fields with explicit fallbacks.
 */

export interface MappableApiImage {
  url?: string;
  is_main?: boolean;
  alt?: string | null;
  alt_text?: string | null;
}

export interface MappableApiVariant {
  id?: string;
  sku?: string;
  availableForSale?: boolean;
}

/**
 * Tag entry — strings on most endpoints, `{id, name}` objects on some
 * GoKwik responses. Mappers normalize to plain strings before badge
 * resolution.
 */
export type MappableApiTag = string | { id?: string; name?: string };

export interface MappableApiProduct {
  id: string;
  title: string;
  handle: string;
  productType?: string;
  product_type?: string;
  price?: number;
  compare_at_price?: number | null;
  image_url?: string;
  image?: { url?: string; alt_text?: string | null };
  images?: MappableApiImage[];
  tags?: MappableApiTag[];
  availableForSale?: boolean;
  variant?: MappableApiVariant;
  variants?: MappableApiVariant[];
  average_rating?: string | number;
  rating_count?: string | number;
  metadata?: Record<string, { value?: unknown } | unknown> | null;
}
