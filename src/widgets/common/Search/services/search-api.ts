import { getCommerceClient } from "@/config/commerce";
import { TrendingSearch } from "../components/TrendingSearches";
import { POPULAR_PRODUCTS } from "../constants/search-constants";

/**
 * Fetches trending searches from mock data
 * @returns Promise with transformed trending search data
 */
export async function fetchTrendingSearches(): Promise<TrendingSearch[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Transform popularProducts to TrendingSearch format
    const trendingSearches = POPULAR_PRODUCTS.map((product, index) => ({
      id: `trending-${index + 1}`,
      label: product.label,
      href: `/collections/${product.collectionHandle}`,
    }));

    return trendingSearches;
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
    const collection = filters?.collection;
    const productType = filters?.productType;
    const sortBy = filters?.sortBy;
    const sortOrder = filters?.sortOrder;
    const inStock = filters?.inStock !== false;
    const onSale = filters?.onSale !== false;
    const minPrice = filters?.minPrice;
    const maxPrice = filters?.maxPrice;
    const minDiscount = filters?.minDiscount;
    const maxDiscount = filters?.maxDiscount;

    const searchApiUrl = process.env.NEXT_PUBLIC_SEARCH_API_URL;
    if (!searchApiUrl) {
      throw new Error("Search API URL not configured");
    }

    let apiUrl = `${searchApiUrl}/products/search?q=${encodeURIComponent(
      query
    )}&page=${page}&pageSize=${pageSize}`;

    if (Array.isArray(collection)) {
      collection.forEach((value) => {
        if (value) {
          apiUrl += `&collection=${encodeURIComponent(value)}`;
        }
      });
    } else if (collection) {
      apiUrl += `&collection=${encodeURIComponent(collection)}`;
    }

    if (Array.isArray(productType)) {
      productType.forEach((value) => {
        if (value) {
          apiUrl += `&productType=${encodeURIComponent(value)}`;
        }
      });
    } else if (productType) {
      apiUrl += `&productType=${encodeURIComponent(productType)}`;
    }

    if (sortBy) {
      apiUrl += `&sortBy=${encodeURIComponent(sortBy)}`;
    }
    if (sortOrder) {
      apiUrl += `&sortOrder=${encodeURIComponent(sortOrder)}`;
    }
    apiUrl += `&inStock=${inStock}&onSale=${onSale}`;
    if (minPrice != null && !Number.isNaN(Number(minPrice))) {
      apiUrl += `&minPrice=${Number(minPrice)}`;
    }
    if (maxPrice != null && !Number.isNaN(Number(maxPrice))) {
      apiUrl += `&maxPrice=${Number(maxPrice)}`;
    }
    if (minDiscount != null && !Number.isNaN(Number(minDiscount))) {
      apiUrl += `&minDiscount=${Number(minDiscount)}`;
    }
    if (maxDiscount != null && !Number.isNaN(Number(maxDiscount))) {
      apiUrl += `&maxDiscount=${Number(maxDiscount)}`;
    }

    // Search is driven by runtime query/filters/pagination; must fetch from widget
    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "gk-merchant-id":
          process.env.NEXT_PUBLIC_MERCHANT_ID || process.env.MERCHANT_ID || "",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Search API request failed: ${response.status} ${response.statusText}`
      );
    }

    const apiData = await response.json();
    const collectionDetailsMap = new Map<string, string>();
    if (Array.isArray(apiData.products)) {
      for (const product of apiData.products) {
        const details = product.collectionDetails;
        if (Array.isArray(details)) {
          for (const c of details) {
            const title = (c.title ?? "").trim();
            const handle = (c.handle ?? "").trim();
            if (title && handle && !collectionDetailsMap.has(title)) {
              collectionDetailsMap.set(title, handle);
            }
          }
        }
      }
    }
    const collectionDetails = Array.from(collectionDetailsMap.entries()).map(
      ([title, handle]) => ({ title, handle })
    );

    const transformedProducts = apiData.products.map((product: any) => {
      const firstVariant = product.variants?.[0];
      const variantId = firstVariant?.variantId;
      const variant = firstVariant
        ? {
            id: firstVariant.variantId,
            title: firstVariant.title ?? "Default Title",
            sku: firstVariant.sku,
          }
        : undefined;
      const pricePaise = firstVariant?.price ?? product.minPrice ?? 0;
      const compareAtPricePaise =
        firstVariant?.compareAtPrice != null
          ? firstVariant.compareAtPrice
          : null;
      const mainImage = product.mainImage ?? product.image ?? "";

      // Pass tags through so the shared ProductCard badge resolver
      // (`getProductLabel` → handleized tag lookup) can pick up
      // "Best Seller", "Trending", "New Launch", etc. Search API returns
      // tags in human form, e.g. "Best Seller" → handleized to
      // "best-seller" → matched against PRODUCT_TAG_LABELS_MAP.
      const tags: string[] = Array.isArray(product.tags) ? product.tags : [];

      // Reshape the search API's flat `metafields: [{namespace, key, value}]`
      // array into the `metadata.{key}.value` map shape that
      // `toCardProduct` reads (mirrors how the collection / PDP APIs
      // expose metafields). Empty array → empty object, badge logic
      // falls through to the tag map cleanly.
      const metadata: Record<string, { value: unknown }> = {};
      if (Array.isArray(product.metafields)) {
        for (const m of product.metafields) {
          if (m && typeof m.key === "string") {
            metadata[m.key] = { value: m.value };
          }
        }
      }

      return {
        id: product.productId,
        title: product.title,
        handle: product.handle,
        productType: product.productType,
        image: mainImage,
        images: product.images,
        imageUrls: product.imageUrls,
        price: pricePaise,
        compareAtPrice: compareAtPricePaise,
        discountedPrice: product.onSale ? pricePaise : pricePaise,
        discount: product.discountPercentage ?? 0,
        rating: product.averageRating || 0,
        reviewsCount: product.ratingCount || 0,
        inStock: product.inStock,
        onSale: product.onSale,
        isInStock: product.inStock,
        variantId,
        variant,
        tags,
        metadata,
      };
    });
    const transformedFilters: any[] = [];
    if (
      apiData.facets?.productTypes &&
      apiData.facets.productTypes.length > 0
    ) {
      transformedFilters.push({
        id: "product_type",
        filter_label: "Product Type",
        source_type: "text",
        position: 1,
        sort_order: "asc",
        values: apiData.facets.productTypes.map((type: any) => ({
          value: type.value,
          count: type.count,
        })),
      });
    }
    if (apiData.facets?.collections && apiData.facets.collections.length > 0) {
      transformedFilters.push({
        id: "st_newcollections",
        filter_label: "Collections",
        source_type: "text",
        position: 2,
        sort_order: "asc",
        values: apiData.facets.collections.map((collection: any) => ({
          value: collection.value,
          count: collection.count,
        })),
      });
    }

    if (apiData.facets?.priceRanges && apiData.facets.priceRanges.length > 0) {
      transformedFilters.push({
        id: "discounted_price",
        filter_label: "Price",
        source_type: "numeric",
        position: 3,
        sort_order: "asc",
        values: apiData.facets.priceRanges.map((range: any) => {
          const min = range.min;
          const max = range.max ?? null;
          let label = "";
          if (min === 0 && max !== null) {
            label = `Below ₹${max}`;
          } else if (max !== null) {
            label = `₹${min} – ₹${max}`;
          } else {
            label = `₹${min} & Above`;
          }
          return {
            value: label,
            count: range.count,
            min,
            max,
          };
        }),
      });
    }

    // Add Tags filter if available
    if (apiData.facets?.tags && apiData.facets.tags.length > 0) {
      transformedFilters.push({
        id: "tags",
        filter_label: "Tags",
        source_type: "text",
        position: 4,
        sort_order: "asc",
        values: apiData.facets.tags.map((tag: any) => ({
          value: tag.value,
          count: tag.count,
        })),
      });
    }

    // Transform facets: pass through handle when provided by backend for stable collection identifiers
    const collectionsFromApi =
      apiData.facets?.collections ?? apiData.collections ?? [];
    const textFacets = {
      st_newcollections: Array.isArray(collectionsFromApi)
        ? collectionsFromApi.map((collection: any) => ({
            label: collection.value ?? collection.title ?? "",
            value: collection.count ?? 0,
            handle: collection.handle,
          }))
        : [],
      product_type:
        apiData.facets?.productTypes?.map((type: any) => ({
          label: type.value,
          value: type.count,
        })) || [],
    };
    const discountRanges =
      apiData.facets?.discountRanges ?? apiData.discountRanges ?? [];
    const priceRanges = apiData.facets?.priceRanges ?? [];
    const maxPriceFromApi = Math.max(
      0,
      ...priceRanges.map((r: any) => r.max).filter((m: any) => m != null)
    );
    const numericFacets = {
      discounted_price: priceRanges
        .filter((r: any) => r.count > 0)
        .map((r: any) => ({
          min: r.min,
          max: r.max ?? null,
          count: r.count,
          minDisplay: r.min / 100,
          maxDisplay: r.max != null ? r.max / 100 : null,
          ...(r.max == null && maxPriceFromApi >= 0
            ? { maxForApi: maxPriceFromApi }
            : {}),
        })),
      discount: discountRanges
        .filter((r: any) => r.count > 0)
        .map((r: any) => ({
          min: r.min,
          max: r.max ?? null,
          count: r.count,
        })),
    };

    return {
      products: transformedProducts,
      totalHits: apiData.total,
      query: query,
      filters: transformedFilters,
      textFacets: textFacets,
      numericFacets: numericFacets,
      collectionDetails,
      pagination: {
        currentPage: apiData.page,
        limit: apiData.pageSize,
        totalPages: apiData.totalPages,
        totalResults: apiData.total,
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
 * Fetches products from the "most-loved-home-page" collection handle using the collection API
 * @param productLimit - Number of products to fetch (default: 12)
 * @returns Promise with products from the most-loved-home-page collection
 */
export async function fetchMostLovedProducts(productLimit: number = 12) {
  try {
    const client = getCommerceClient();
    // `getCollectionsByHandles` is the typed v2 commerce client method that
    // auto-injects platform auth (gk-merchant-id, store id, signed token)
    // — much more reliable than calling the underlying URL directly.
    const response = await client.getCollectionsByHandles({
      handles: ["bestseller"],
      productLimit,
    });

    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch bestseller collection"
      );
    }

    // Shopkit's custom adapter normalises each collection into a wrapper:
    //   { handle, data: <raw collection with products>, meta, success, ... }
    // So products live at `entry.data.products`. We also fall back to
    // `entry.products` and `data.collections[].data.products` defensively.
    type RawCollection = {
      handle?: string;
      products?: unknown[];
      title?: string;
    };
    type NormalisedEntry = {
      handle?: string;
      data?: RawCollection;
      products?: unknown[];
    };
    const rawData = response.data as
      | NormalisedEntry[]
      | { collections?: NormalisedEntry[] }
      | null;
    const entries: NormalisedEntry[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.collections)
        ? (rawData!.collections as NormalisedEntry[])
        : [];

    const bestsellerEntry =
      entries.find((c) => c?.handle === "bestseller") ?? entries[0];

    const products: unknown[] = Array.isArray(bestsellerEntry?.data?.products)
      ? (bestsellerEntry!.data!.products as unknown[])
      : Array.isArray(bestsellerEntry?.products)
        ? (bestsellerEntry!.products as unknown[])
        : [];

    return {
      products,
      totalHits: products.length,
      collectionHandle: bestsellerEntry?.handle ?? "bestseller",
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
