/**
 * The normalized product-detail contract — the ONE shape shared between the
 * server that produces it (src/app/api/voice-product/route.ts) and every client
 * consumer (the PDP-prefetch, the memory ref, the get_current_product tool). It
 * lives in its own tiny module (types only, no runtime) so neither side re-guesses
 * the payload and the two can never drift.
 *
 * Declared as a `type` (not `interface`) on purpose: object type-aliases are
 * assignable to `Record<string, unknown>`, so a tool can return one directly.
 */

export type VoiceProductVariant = {
  variant_id: string;
  title: string;
  options?: string[];
  price: number;
  /** Ready-to-speak price with the store's currency symbol (e.g. "₹499"). The model
   *  reads THIS verbatim; the bare `price` above is for internal logic only. */
  price_display?: string | null;
  available: boolean;
};

export type VoiceProductDetail = {
  product_id: string;
  variant_id?: string;
  title: string;
  handle: string;
  brand: string | null;
  category: string | null;
  tags: string[];
  price: number;
  compare_at_price: number | null;
  /** Ready-to-speak strings with the currency symbol baked in (e.g. "₹499"). The
   *  model must SPEAK these; the bare numeric fields are internal-only. */
  price_display?: string | null;
  compare_at_display?: string | null;
  on_sale: boolean;
  discount_pct: number;
  available: boolean;
  variants: VoiceProductVariant[];
  image_url: string;
  images_count: number;
  description: string;
  attributes: Record<string, string>;
};
