/**
 * The voice agent's canonical CATALOG PRODUCT contract — the normalized shape of a
 * product in a result list / working set, shared by the tools, memory, hooks, and
 * the data adapters that feed them.
 *
 * OWNERSHIP: this type lives INSIDE the voice module on purpose. It used to be
 * defined in a host util (`@/utils/searchService`); it was moved here so the voice
 * engine owns its own data contract and can be lifted into a standalone repo/SDK
 * without depending on the merchant project. The host util now RE-EXPORTS this type
 * (as `TransformedProduct`) so every existing importer keeps working unchanged —
 * dependency inversion with zero behavioural change.
 *
 * (The richer single-product PDP shape is `VoiceProductDetail` in ./productDetail.)
 */
export interface VoiceProduct {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  rating: number;
  reviewCount: number;
  variantId: string;
  // Optional structured attributes (present only when the backend supplies them).
  productType?: string;
  brand?: string;
  tags?: string[];
  /** Distinct variant option values (e.g. colours / sizes), for reasoning + filtering. */
  options?: string[];
  /** Short plain-text description snippet — carried for attribute matching (e.g.
   *  "sulfate-free", "vegan", ingredients), NOT sent to the model (keeps payload/
   *  token cost flat). Present only when the search backend returns a description. */
  description?: string;
}

/**
 * Backward-compatible alias. The engine and the host historically referred to this
 * shape as `TransformedProduct`; keep the name working so no importer must change.
 * New code should prefer `VoiceProduct`. (Kept as an alias, not a second type, so
 * they can never drift.)
 */
export type TransformedProduct = VoiceProduct;
