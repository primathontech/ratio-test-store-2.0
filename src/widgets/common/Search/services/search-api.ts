import { getCommerceClient } from "@/config/commerce";
import { TrendingSearch } from "../components/TrendingSearches";

/**
 * "Popular Choices" chips — derived GENERICALLY from the merchant's own
 * collections (no hardcoded handles). Each collection becomes a chip linking to
 * its PLP, so this works for any merchant just by changing the merchant ID.
 * @returns Promise with transformed trending search data
 */
export async function fetchTrendingSearches(): Promise<TrendingSearch[]> {
  try {
    const client = getCommerceClient();
    const resp = (await client.getCollections({ first: 8 } as never)) as {
      data?: unknown[];
    };
    const collections: any[] = Array.isArray(resp?.data)
      ? (resp.data as any[])
      : [];

    return collections
      .filter((c) => c && c.handle)
      .slice(0, 8)
      .map((c, index) => ({
        id: `trending-${index + 1}`,
        label: String(c.title || c.handle),
        href: `/collections/${c.handle}`,
      }));
  } catch (error) {
    throw new TrendingSearchApiError(
      error instanceof Error
        ? error.message
        : "Failed to fetch trending searches"
    );
  }
}

/**
 * Custom error class for trending search API errors
 */
export class TrendingSearchApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "TrendingSearchApiError";
  }
}
/**
 * Hook-like function to fetch trending searches (already transformed by API route)
 * @returns Promise with transformed results
 */
export async function getTrendingSearchesForComponent() {
  try {
    const results = await fetchTrendingSearches();
    return results;
  } catch (error) {
    return [];
  }
}

/**
 * Fetches recommended products dynamically
 * @returns Promise with recommended products data
 */
export async function fetchRecommendedProducts() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Return empty array - should be implemented with actual API call
    const recommendedProducts: any[] = [];
    return recommendedProducts;
  } catch (error) {
    throw new TrendingSearchApiError(
      error instanceof Error
        ? error.message
        : "Failed to fetch recommended products"
    );
  }
}

/**
 * Hook-like function to fetch recommended products for component
 * @returns Promise with recommended products
 */
export async function getRecommendedProductsForComponent() {
  try {
    const results = await fetchRecommendedProducts();
    return results;
  } catch (error) {
    return [];
  }
}

/**
 * Searches products using the search API
 * @param query - Search query string
 * @param filters - Optional filters object
 * @returns Promise with search results
 */
export async function searchProducts(
  query: string,
  filters?: {
    textFacetFilters?: Record<string, string[]>;
    numericFacetFilters?: Record<string, string[]>;
    sort?: string;
    page?: number;
    limit?: number;
    collection?: string | string[];
    productType?: string | string[];
    sortBy?: string;
    sortOrder?: string;
    inStock?: boolean;
    onSale?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minDiscount?: number;
    maxDiscount?: number;
  }
) {
  try {
    const page = filters?.page || 1;
    const pageSize = filters?.limit || 20;
    const minPrice = filters?.minPrice;
    const maxPrice = filters?.maxPrice;

    // GENERIC, INDEX-FREE SEARCH.
    //
    // The dedicated search backend (NEXT_PUBLIC_SEARCH_API_URL) requires a
    // per-merchant index that is not provisioned for every merchant, and the
    // product API does not text-filter server-side. So search is powered
    // generically from the merchant's OWN catalog: pull available products via
    // the commerce client (works on any configured backend, injects merchant
    // auth automatically) and filter them CLIENT-SIDE by the query. This makes
    // "whatever the merchant has" searchable with zero search-index dependency.
    const client = getCommerceClient();
    // The custom adapter caps `first` at 100; that's the browse-able catalog we
    // filter over. (Enough for a generic store; raise via server search once a
    // real index exists.)
    const resp = (await client.getProducts({ first: 100 } as never)) as {
      data?: unknown[];
    };
    const all: any[] = Array.isArray(resp?.data) ? (resp.data as any[]) : [];

    const q = (query || "").trim().toLowerCase();
    const matches = q
      ? all.filter((p) => {
          const hay = [p?.title, p?.handle, p?.productType, p?.product_type]
            .filter(Boolean)
            .map((s: unknown) => String(s).toLowerCase());
          return hay.some((s) => s.includes(q));
        })
      : all;

    // Optional client-side price-range narrowing (prices are in paise).
    const priceOf = (p: any) => Number(p?.price ?? p?.minPrice ?? 0);
    const filtered = matches.filter((p) => {
      const price = priceOf(p);
      if (
        minPrice != null &&
        !Number.isNaN(Number(minPrice)) &&
        price < Number(minPrice)
      ) {
        return false;
      }
      if (
        maxPrice != null &&
        !Number.isNaN(Number(maxPrice)) &&
        price > Number(maxPrice)
      ) {
        return false;
      }
      return true;
    });

    // Client-side pagination over the filtered catalog.
    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    const transformedProducts = pageItems.map((product: any) => {
      const rawImages = Array.isArray(product.images) ? product.images : [];
      const firstImageUrl =
        typeof rawImages[0] === "string" ? rawImages[0] : rawImages[0]?.url;
      const mainImage =
        product.image_url ||
        product.mainImage ||
        product.image ||
        firstImageUrl ||
        "";
      const pricePaise = Number(product.price ?? product.minPrice ?? 0);
      const compareAtPricePaise =
        product.compare_at_price != null
          ? Number(product.compare_at_price)
          : product.compareAtPrice != null
            ? Number(product.compareAtPrice)
            : null;
      const inStock = product.product_availability ?? product.inStock ?? true;
      const variantId =
        product.variants?.[0]?.variantId ?? `${product.id}-variant`;
      const tags: string[] = Array.isArray(product.tags) ? product.tags : [];

      return {
        id: product.id ?? product.productId,
        title: product.title,
        handle: product.handle,
        productType: product.productType ?? product.product_type,
        image: mainImage,
        images: rawImages,
        imageUrls: product.imageUrls,
        price: pricePaise,
        compareAtPrice: compareAtPricePaise,
        discountedPrice: pricePaise,
        discount: product.discountPercentage ?? 0,
        rating: Number(product.average_rating ?? product.rating ?? 0) || 0,
        reviewsCount:
          Number(product.rating_count ?? product.reviewsCount ?? 0) || 0,
        inStock,
        onSale: compareAtPricePaise != null && compareAtPricePaise > pricePaise,
        isInStock: inStock,
        variantId,
        variant: { id: variantId, title: "Default Title" },
        tags,
        metadata: {},
      };
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    // No server-side facets in catalog-filter mode — the filter sidebar simply
    // shows no facet options (graceful: the grid + query still work).
    return {
      products: transformedProducts,
      totalHits: filtered.length,
      query: query,
      filters: [] as any[],
      textFacets: { st_newcollections: [], product_type: [] },
      numericFacets: { discounted_price: [], discount: [] },
      collectionDetails: [] as { title: string; handle: string }[],
      pagination: {
        currentPage: page,
        limit: pageSize,
        totalPages,
        totalResults: filtered.length,
      },
    };
  } catch (error) {
    throw new TrendingSearchApiError(
      error instanceof Error ? error.message : "Failed to search products"
    );
  }
}

/**
 * Hook-like function to search products for component
 * @param query - Search query string
 * @param filters - Optional filters object
 * @returns Promise with search results
 */
export async function getSearchResultsForComponent(
  query: string,
  filters?: {
    textFacetFilters?: Record<string, string[]>;
    numericFacetFilters?: Record<string, string[]>;
    sort?: string;
    page?: number;
    limit?: number;
    collection?: string | string[];
    productType?: string | string[];
    sortBy?: string;
    sortOrder?: string;
    inStock?: boolean;
    onSale?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minDiscount?: number;
    maxDiscount?: number;
  }
) {
  try {
    const results = await searchProducts(query, filters);
    return results;
  } catch (error) {
    console.error("Error getting search results for component:", error);
    return {
      products: [],
      totalHits: 0,
      query: query,
      textFacets: {},
      numericFacets: {},
      pagination: {
        currentPage: 1,
        limit: 30,
        totalPages: 1,
        totalResults: 0,
      },
    };
  }
}

/**
 * Hook-like function to get bestselling products for no results page using mock data
 * @returns Promise with bestselling products (12 products)
 */
export async function getBestsellingProductsForNoResults() {
  try {
    // Use the existing getMostLovedProductsForComponent function to get bestselling products
    const result = await getMostLovedProductsForComponent(12);

    return {
      products: result.products || [],
      totalHits: result.totalHits || 0,
      query: "*",
      textFacets: {},
      numericFacets: {},
    };
  } catch (error) {
    console.error("Error getting bestselling products for no results:", error);
    return {
      products: [],
      totalHits: 0,
      query: "*",
      textFacets: {},
      numericFacets: {},
    };
  }
}

/**
 * Products for the "Recommended for you" rail and the no-results page — sourced
 * GENERICALLY from the merchant's catalog (no hardcoded collection handle). Any
 * merchant with products gets a populated rail just by changing the merchant ID.
 * @param productLimit - Number of products to fetch (default: 12)
 * @returns Promise with available products
 */
export async function fetchMostLovedProducts(productLimit: number = 12) {
  try {
    const client = getCommerceClient();
    // The custom adapter reads pagination from `params.first` (caps at 100) and
    // injects merchant auth automatically.
    const response = (await client.getProducts({
      first: Math.min(Math.max(productLimit, 1), 100),
    } as never)) as { data?: unknown[]; success?: boolean; message?: string };

    if (response && response.success === false) {
      throw new Error(response.message || "Failed to fetch products");
    }

    const products: unknown[] = Array.isArray(response?.data)
      ? (response.data as unknown[])
      : [];

    return {
      products,
      totalHits: products.length,
      collectionHandle: "",
      productLimit,
      apiResponse: response,
    };
  } catch (error) {
    console.error("Error fetching most loved products from API:", error);
    throw new TrendingSearchApiError(
      error instanceof Error
        ? error.message
        : "Failed to fetch most loved products from API"
    );
  }
}

/**
 * Hook-like function to get most loved products for component
 * @param productLimit - Number of products to fetch (default: 12)
 * @returns Promise with most loved products or empty array on error
 */
export async function getMostLovedProductsForComponent(
  productLimit: number = 12
) {
  try {
    const results = await fetchMostLovedProducts(productLimit);
    return results;
  } catch (error) {
    console.error("Error getting most loved products for component:", error);
    return {
      products: [],
      totalHits: 0,
      collectionHandle: "bestseller",
      productLimit: productLimit,
    };
  }
}
