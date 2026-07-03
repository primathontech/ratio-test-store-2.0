import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";

/**
 * Data-source dropdown options for the visual editor.
 *
 * Called same-origin from the editor iframe (via EditorHost's
 * fetchDataSourceOptions over the bridge) — so no CORS, and the commerce
 * call runs server-side through the data-layer client. Returns the merchant's
 * collections/products as `{value,label}[]`; `value` is the handle written
 * into the data source's params.
 *
 * Best-effort: any failure returns `{ data: [] }` so the editor field falls
 * back to the saved handle rather than erroring.
 */

const COLLECTION_LIMIT = 250;
// Custom adapter caps getProducts.first at 100.
const PRODUCT_LIMIT = 100;

type OptionSource = "collections" | "products";
type Option = { value: string; label: string };

// The custom adapter's mappers are pass-through, so field names come straight
// from the backend — pick defensively: handle → slug → id, title → name → label.
function toOption(item: Record<string, unknown>): Option | null {
  const value = item?.handle ?? item?.slug ?? item?.id ?? item?._id;
  if (value == null || value === "") {
    return null;
  }
  const label = item?.title ?? item?.name ?? item?.label ?? String(value);
  return { value: String(value), label: String(label) };
}

function listFrom(data: unknown, key: "collections" | "products"): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }
  const nested = (data as Record<string, unknown> | null)?.[key];
  return Array.isArray(nested) ? nested : [];
}

async function fetchOptions(source: OptionSource): Promise<Option[]> {
  const client = getCommerceClient();
  if (source === "collections") {
    const res = await client.getCollections({ first: COLLECTION_LIMIT });
    return listFrom(res?.data, "collections")
      .map((i) => toOption(i as Record<string, unknown>))
      .filter((o): o is Option => o !== null);
  }
  const res = await client.getProducts({ first: PRODUCT_LIMIT });
  return listFrom(res?.data, "products")
    .map((i) => toOption(i as Record<string, unknown>))
    .filter((o): o is Option => o !== null);
}

export async function POST(request: NextRequest) {
  try {
    const { source } = (await request.json()) as {
      source?: OptionSource;
    };
    if (source !== "collections" && source !== "products") {
      return NextResponse.json(
        { error: "source must be 'collections' or 'products'" },
        { status: 400 }
      );
    }
    const data = await fetchOptions(source);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching data source options:", error);
    // Best-effort: empty list, editor falls back to the saved handle.
    return NextResponse.json({ data: [] });
  }
}
