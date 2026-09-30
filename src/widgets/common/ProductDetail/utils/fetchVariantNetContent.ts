import { getCommerceClient } from "@/config/commerce";

/**
 * Fetch the net-content metafield for a list of product handles in parallel.
 * Used by `VariantPicker` to render per-variant unit-price labels (₹3.00/ml).
 *
 * Adapted from the reference's `fetchProductDetails`:
 *   - reference imports from `@/lib/data-layer` which doesn't exist here
 *   - this version uses `@/config/commerce`'s `getCommerceClient` (project pattern)
 *   - return shape simplified: `{ handle, netContent }` per slot, slot-aligned
 *     with the input array (failed/missing entries stay as empty string).
 */
export interface VariantNetContent {
  handle: string;
  netContent: string;
}

export async function fetchVariantNetContent(
  handles: string[]
): Promise<VariantNetContent[]> {
  if (!Array.isArray(handles) || handles.length === 0) {
    return [];
  }

  try {
    const client = getCommerceClient();

    const requests = handles.map(async (handle): Promise<VariantNetContent> => {
      if (!handle) {
        return { handle: "", netContent: "" };
      }
      try {
        const response: unknown = await client.getProduct({ handle });
        const data = (response as { data?: unknown })?.data ?? response;
        const meta = (
          data as {
            metadata?: { product_net_content?: { value?: unknown } };
          }
        )?.metadata?.product_net_content?.value;
        const netContent = Array.isArray(meta)
          ? typeof meta[0] === "string"
            ? (meta[0] as string)
            : ""
          : typeof meta === "string"
            ? meta
            : "";
        return { handle, netContent };
      } catch (error) {
        console.error(
          `[VariantPicker] failed to fetch product "${handle}":`,
          error
        );
        return { handle, netContent: "" };
      }
    });

    return Promise.all(requests);
  } catch (error) {
    console.error("[VariantPicker] fetchVariantNetContent error:", error);
    return [];
  }
}
