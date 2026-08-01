import { paiseToRupees } from "@/utils/apiTransforms";

export interface SearchProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  images?: Array<{
    url: string;
    is_main: boolean;
    alt?: string;
  }>;
  product_availability?: boolean;
  availableForSale?: boolean;
  variants?: Array<{
    id: string;
    title: string;
    sku: string;
    quantityAvailable: number;
    availableForSale: boolean;
    price: { amount: number; currencyCode: string };
    compareAtPrice?: { amount: number; currencyCode: string };
    image?: { url: string | null; altText: string | null };
  }>;
  average_rating?: number;
  rating_count?: number;
}

export interface TransformedProduct {
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
}

interface SearchApiResponse {
  products: SearchProduct[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    has_more: boolean;
  };
}

function transformApiProduct(apiProduct: SearchProduct): TransformedProduct {
  const firstVariant = apiProduct.variants?.[0];

  const price = firstVariant?.price?.amount
    ? paiseToRupees(firstVariant.price.amount)
    : paiseToRupees(apiProduct.price);

  const compareAtPrice = firstVariant?.compareAtPrice?.amount
    ? paiseToRupees(firstVariant.compareAtPrice.amount)
    : apiProduct.compare_at_price
      ? paiseToRupees(apiProduct.compare_at_price)
      : undefined;

  return {
    id: apiProduct.id,
    handle: apiProduct.handle,
    title: apiProduct.title,
    imageUrl:
      apiProduct.image_url ||
      apiProduct.images?.find((img) => img.is_main)?.url ||
      apiProduct.images?.[0]?.url ||
      "",
    price,
    compareAtPrice,
    available:
      firstVariant?.availableForSale ??
      apiProduct.availableForSale ??
      apiProduct.product_availability ??
      true,
    rating: apiProduct.average_rating ?? 4.5,
    reviewCount: apiProduct.rating_count ?? 0,
    variantId: firstVariant?.id || `${apiProduct.id}-variant`,
  };
}

export async function searchProducts(
  query: string,
  limit: number = 50,
  page: number = 1
): Promise<{ products: TransformedProduct[]; totalCount: number }> {
  const response = await fetch("/api/v1/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      limit,
      page,
      storeId:
        process.env.NEXT_PUBLIC_STORE_ID || process.env.NEXT_PUBLIC_MERCHANT_ID,
      show_variants: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Search API failed: ${response.status}`);
  }

  const data: SearchApiResponse = await response.json();
  const transformedProducts = data.products.map(transformApiProduct);

  return {
    products: transformedProducts,
    totalCount: data.pagination?.total || transformedProducts.length,
  };
}
