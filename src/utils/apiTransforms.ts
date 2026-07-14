/**
 * Shared API data transform utilities for widgets consuming builder dataSources.
 *
 * Custom backend returns prices in PAISE (1 rupee = 100 paise).
 * Use paiseToRupees() before display and formatINR() for formatted strings.
 */

/** Convert paise to rupees */
export function paiseToRupees(paise: unknown): number {
  const num = Number(paise);
  return isNaN(num) ? 0 : num / 100;
}

/** Format rupees to ₹X,XXX display string */
export function formatINR(amount: number): string {
  if (isNaN(amount)) {
    return "";
  }
  return (
    "₹" +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
}

/** Detect IResponse shape from builder dataSources */
export function isIResponse(
  data: unknown
): data is { success: boolean; data: unknown } {
  if (!data || typeof data !== "object") {
    return false;
  }
  return "success" in (data as object) && "data" in (data as object);
}

/** Detect COLLECTION_BY_HANDLES shape (array of { handle, data/products }) */
export function isCollectionEntries(data: any[]): boolean {
  const first = data[0];
  if (!first || typeof first !== "object") {
    return false;
  }
  return "handle" in first && ("data" in first || "products" in first);
}

/** Extract products from COLLECTION_BY_HANDLES entries */
export function extractCollectionProducts(entries: any[]): any[] {
  const result: any[] = [];
  for (const entry of entries) {
    const products = entry.data?.products ?? entry.products ?? [];
    if (Array.isArray(products)) {
      result.push(...products);
    }
  }
  return result;
}
