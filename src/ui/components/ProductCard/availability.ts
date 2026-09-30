/**
 * Resolve a product's effective purchasability from the two signals the
 * commerce APIs expose.
 *
 * Rule (shared across collection cards, carousels, and PDP):
 *   - `availableForSale === true`  → available. Authoritative; skip quantity.
 *   - `availableForSale === false` → fall back to stock: available iff
 *                                    `availableQuantity > 0`.
 *   - `availableForSale === undefined` → left untouched (callers keep their
 *                                    own fallback, e.g. ProductCard's price check).
 *
 * The collection API reports quantity on the singular `variant`, the PDP API
 * on the selected entry in `variants[]` — pass whichever applies.
 */
export function resolveAvailableForSale(
  availableForSale: boolean | undefined,
  availableQuantity: number | null | undefined
): boolean | undefined {
  if (availableForSale === false) {
    return (availableQuantity ?? 0) > 0;
  }
  return availableForSale;
}
