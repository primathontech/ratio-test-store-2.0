import { NextResponse } from "next/server";
import { captureSentryException } from "@/lib/sentry/utils";

export const revalidate = 3600;

const PRODUCT_API_URL = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";
const STORE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://themomsco.com";
const BRAND = "The Moms Co";
const STORE_TITLE = "The Moms Co";
const FEED_DESCRIPTION = "Product feed for Google Merchant Center";

type CollectionProduct = { handle?: string; status?: string };
type Collection = { products?: CollectionProduct[] };

type Image = { url?: string; is_main?: boolean; position?: number };
type Variant = {
  id?: string | number;
  title?: string;
  price?: number;
  compare_at_price?: number;
  sku?: string;
  barcode?: string;
  inventory_quantity?: number;
  availableForSale?: boolean;
  availableQuantity?: number;
  option_values?: string[];
};
type ProductDetail = {
  id?: string | number;
  title?: string;
  description?: string;
  handle?: string;
  product_type?: string;
  status?: string;
  price?: number;
  compare_at_price?: number;
  image?: Image;
  images?: Image[];
  variants?: Variant[];
  availableForSale?: boolean;
};

const escapeXml = (raw: string): string =>
  raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const stripHtml = (html: string): string =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const formatPrice = (paise: number): string =>
  `${(paise / 100).toFixed(2)} INR`;

const truncate = (s: string, max: number): string =>
  s.length <= max ? s : s.slice(0, max - 1).trimEnd();

async function fetchAllCollections(): Promise<Collection[]> {
  const url = `${PRODUCT_API_URL}/api/v1/collections?storeId=${MERCHANT_ID}&page=1&limit=200`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "gk-merchant-id": MERCHANT_ID,
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`collections ${res.status}`);
  }
  const data = await res.json();
  return (data?.collections as Collection[]) || [];
}

async function fetchProductDetail(
  handle: string
): Promise<ProductDetail | null> {
  const res = await fetch(`${PRODUCT_API_URL}/api/v1/product/details`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "gk-merchant-id": MERCHANT_ID,
    },
    body: JSON.stringify({ productHandle: handle }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return (data?.product as ProductDetail) || null;
}

function pickMainImage(product: ProductDetail): string | undefined {
  const images = product.images || [];
  const main = images.find((i) => i.is_main && i.url) || images[0];
  return main?.url || product.image?.url;
}

function pickAdditionalImages(
  product: ProductDetail,
  mainUrl?: string
): string[] {
  const images = product.images || [];
  return images
    .filter((i) => i.url && i.url !== mainUrl)
    .map((i) => i.url as string)
    .slice(0, 10);
}

function isInStock(variant: Variant): boolean {
  if (typeof variant.availableForSale === "boolean") {
    return variant.availableForSale;
  }
  if (typeof variant.availableQuantity === "number") {
    return variant.availableQuantity > 0;
  }
  if (typeof variant.inventory_quantity === "number") {
    return variant.inventory_quantity > 0;
  }
  return true;
}

function buildItem(
  product: ProductDetail,
  variant: Variant,
  hasMultipleVariants: boolean
): string {
  const productTitle = (product.title || "").trim();
  const variantTitle = (variant.title || "").trim();
  const title =
    hasMultipleVariants &&
    variantTitle &&
    variantTitle.toLowerCase() !== "default title"
      ? `${productTitle} - ${variantTitle}`
      : productTitle;

  const id = String(variant.sku || variant.id || product.id || "").trim();
  const link = `${STORE_URL}/products/${product.handle}`;
  const description = truncate(
    stripHtml(product.description || productTitle),
    5000
  );
  const mainImage = pickMainImage(product);
  const additionalImages = pickAdditionalImages(product, mainImage);

  const compareAt = variant.compare_at_price ?? product.compare_at_price ?? 0;
  const price = variant.price ?? product.price ?? 0;
  const hasDiscount = compareAt > 0 && price > 0 && compareAt > price;
  const listPrice = compareAt > 0 ? compareAt : price;

  const availability = isInStock(variant) ? "in_stock" : "out_of_stock";
  const productType = (product.product_type || "").trim();
  const size = variant.option_values?.[0]?.trim();
  const barcode = variant.barcode?.trim();
  const sku = variant.sku?.trim();

  const lines: string[] = ["    <item>"];
  lines.push(`      <g:id>${escapeXml(id)}</g:id>`);
  lines.push(`      <title>${escapeXml(truncate(title, 150))}</title>`);
  lines.push(`      <link>${escapeXml(link)}</link>`);
  lines.push(`      <description>${escapeXml(description)}</description>`);
  if (mainImage) {
    lines.push(`      <g:image_link>${escapeXml(mainImage)}</g:image_link>`);
  }
  lines.push(`      <g:availability>${availability}</g:availability>`);
  lines.push(`      <g:price>${escapeXml(formatPrice(listPrice))}</g:price>`);
  if (hasDiscount) {
    lines.push(
      `      <g:sale_price>${escapeXml(formatPrice(price))}</g:sale_price>`
    );
  }
  lines.push(`      <g:brand>${escapeXml(BRAND)}</g:brand>`);
  lines.push(`      <g:condition>new</g:condition>`);
  lines.push(
    `      <g:item_group_id>${escapeXml(String(product.id || ""))}</g:item_group_id>`
  );
  if (sku) {
    lines.push(`      <g:mpn>${escapeXml(sku)}</g:mpn>`);
  }
  if (barcode) {
    lines.push(`      <g:gtin>${escapeXml(barcode)}</g:gtin>`);
  }
  if (productType) {
    lines.push(
      `      <g:product_type>${escapeXml(productType)}</g:product_type>`
    );
  }
  if (size) {
    lines.push(`      <g:size>${escapeXml(size)}</g:size>`);
  }
  for (const img of additionalImages) {
    lines.push(
      `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`
    );
  }
  lines.push("    </item>");
  return lines.join("\n");
}

function buildFeed(products: ProductDetail[]): string {
  const items: string[] = [];
  for (const product of products) {
    if (product.status && product.status !== "active") {
      continue;
    }
    const mainImage = pickMainImage(product);
    if (!mainImage) {
      continue;
    }
    const variants = product.variants?.length
      ? product.variants
      : [{} as Variant];
    const hasMultiple = variants.length > 1;
    for (const variant of variants) {
      const price = variant.price ?? product.price ?? 0;
      const compareAt =
        variant.compare_at_price ?? product.compare_at_price ?? 0;
      const listPrice = compareAt > 0 ? compareAt : price;
      if (listPrice <= 0) {
        continue;
      }
      items.push(buildItem(product, variant, hasMultiple));
    }
  }

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">`,
    `  <channel>`,
    `    <title>${escapeXml(STORE_TITLE)}</title>`,
    `    <link>${escapeXml(STORE_URL)}</link>`,
    `    <description>${escapeXml(FEED_DESCRIPTION)}</description>`,
    items.join("\n"),
    `  </channel>`,
    `</rss>`,
  ].join("\n");
}

export async function GET() {
  try {
    if (!PRODUCT_API_URL || !MERCHANT_ID) {
      return new NextResponse("Feed misconfigured", { status: 500 });
    }

    const collections = await fetchAllCollections();
    const handles = new Set<string>();
    for (const c of collections) {
      for (const p of c.products || []) {
        if (p.handle && p.status !== "draft" && p.status !== "archived") {
          handles.add(p.handle);
        }
      }
    }

    const products = (
      await Promise.all(
        Array.from(handles).map((h) => fetchProductDetail(h).catch(() => null))
      )
    ).filter((p): p is ProductDetail => p !== null);

    const xml = buildFeed(products);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    captureSentryException(error, {
      tags: { flow: "seo", operation: "googleMerchantFeed", errorType: "feed" },
    });
    return new NextResponse("Feed temporarily unavailable", { status: 503 });
  }
}
