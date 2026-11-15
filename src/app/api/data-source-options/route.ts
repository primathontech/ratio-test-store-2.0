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
// Guards against a backend that never reports itself exhausted.
const MAX_COLLECTION_PAGES = 20;
const MAX_PRODUCT_PAGES = 20;

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

// A catalog can span more pages than a single request returns (some backends
// cap page size below what `first` asks for). Follow pagination until
// exhausted so the editor's picker isn't missing entries. Handles both
// pagination shapes the adapters produce: numbered pages (custom adapter —
// `pagination.hasNext`, no cursor, so the page number is advanced here) and
// cursor-based (Shopify — GraphQL `pageInfo.hasNextPage` / `endCursor`).
async function fetchAllCollections(
  client: ReturnType<typeof getCommerceClient>
): Promise<unknown[]> {
  const items: unknown[] = [];
  let after: string | undefined;
  let page = 1;

  for (let i = 0; i < MAX_COLLECTION_PAGES; i++) {
    const res = await client.getCollections({ first: COLLECTION_LIMIT, after });
    items.push(...listFrom(res?.data, "collections"));
    if (items.length >= COLLECTION_LIMIT) {
      break;
    }

    const pagination = (
      res?.meta as { pagination?: Record<string, unknown> } | undefined
    )?.pagination;
    const hasMore = Boolean(
      pagination?.hasNextPage ?? pagination?.hasNext ?? false
    );
    if (!hasMore) {
      break;
    }

    if (typeof pagination?.endCursor === "string") {
      after = pagination.endCursor;
    } else {
      page += 1;
      after = String(page);
    }
  }

  return items;
}

// Same shape as fetchAllCollections, but the products backend's pagination
// is snake_case (`has_more`, `total_pages`) instead of collections'
// camelCase — and unlike collections, sending `page`/`current_page` back in
// the request is silently ignored; only `after` (a stringified page number)
// actually advances the page. Verified directly against the backend, not
// assumed from the collections shape.
async function fetchAllProducts(
  client: ReturnType<typeof getCommerceClient>
): Promise<unknown[]> {
  const items: unknown[] = [];
  let after: string | undefined;
  let page = 1;

  for (let i = 0; i < MAX_PRODUCT_PAGES; i++) {
    const res = await client.getProducts({ first: PRODUCT_LIMIT, after });
    items.push(...listFrom(res?.data, "products"));

    const pagination = (
      res?.meta as { pagination?: Record<string, unknown> } | undefined
    )?.pagination;
    const hasMore = Boolean(
      pagination?.hasNextPage ??
      pagination?.hasNext ??
      pagination?.has_more ??
      false
    );
    if (!hasMore) {
      break;
    }

    if (typeof pagination?.endCursor === "string") {
      after = pagination.endCursor;
    } else {
      page += 1;
      after = String(page);
    }
  }

  return items;
}

async function fetchOptions(source: OptionSource): Promise<Option[]> {
  const client = getCommerceClient();
  if (source === "collections") {
    const items = await fetchAllCollections(client);
    return items
      .map((i) => toOption(i as Record<string, unknown>))
      .filter((o): o is Option => o !== null);
  }
  const items = await fetchAllProducts(client);
  return items
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
