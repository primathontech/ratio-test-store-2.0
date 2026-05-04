import type { ICommerceClient } from "@shopkit/data-layer";
import { getCommerceClient } from "@/config/commerce";
import {
  CollectionApiResponse,
  ProductEdge,
  ProductNode,
  TransformedCollection,
  TransformedProduct,
} from "./types";

/** v2 — collection fetch (used for sort, filter apply, load more, preview count) */
const COLLECTION_API_VERSION = "v2";

/** v1 — collection filters list (sidebar filter options + counts) */
const FILTERS_API_VERSION = "v1";

export class CollectionApiClient {
  private client: ICommerceClient = getCommerceClient();
  private storeId = process.env.NEXT_PUBLIC_STORE_ID!;

  /**
   * Fetch collection data by handle via the shopkit data-layer.
   * Routes through `getCollection` so we ride on the same auth/header
   * conventions the SSR fetch already uses successfully.
   */
  async fetchCollection(
    handle: string,
    options: {
      first?: number;
      after?: string;
      sort?: string;
      reverse?: boolean;
      filters?: Array<{ filterId: string; values: string[] }>;
    } = {}
  ): Promise<TransformedCollection> {
    const { first = 6, after, sort, reverse, filters } = options;

    const params: Record<string, string | number | boolean> = {
      storeId: this.storeId,
      first,
    };

    if (after) {
      params.after = after;
    }
    if (sort) {
      params.sort = sort;
    }
    if (reverse !== undefined) {
      params.reverse = reverse;
    }
    if (filters && filters.length > 0) {
      params.filters = JSON.stringify(filters);
    }

    const response = await this.client.getCollection(
      { handle },
      { version: COLLECTION_API_VERSION, params }
    );

    if (!response.success) {
      throw new Error(response.message ?? "Failed to fetch collection");
    }
    return this.transformCollectionData(
      response as unknown as CollectionApiResponse
    );
  }

  /**
   * Transform API response to a more usable format
   */
  public transformCollectionData(
    apiResponse: CollectionApiResponse
  ): TransformedCollection {
    const collection = apiResponse.data.data.collectionByHandle;

    const transformedProducts: TransformedProduct[] =
      collection.products.edges.map((edge: ProductEdge) =>
        this.transformProduct(edge.node)
      );

    return {
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description: collection.description,
      products: transformedProducts,
      productCount: collection.products.productCount,
      hasNextPage: collection.products.pageInfo.hasNextPage,
      hasPreviousPage: collection.products.pageInfo.hasPreviousPage,
      startCursor: collection.products.pageInfo.startCursor,
      endCursor: collection.products.pageInfo.endCursor,
    };
  }

  /**
   * Transform individual product data
   */
  private transformProduct(product: ProductNode): TransformedProduct {
    // Extract images
    const images = product.images.edges.map((edge) => ({
      url: edge.node.src,
      is_main: edge.node.isMain,
      alt: edge.node.altText ?? null,
    }));

    // Extract labels
    const labels = product.metadata.product_labels?.value
      ? [product.metadata.product_labels.value]
      : [];

    // Extract subtitle
    const subtitle = product.metadata.product_subtitle?.value || "";

    // Extract net content
    const netContent = product.metadata.product_net_content?.value || "";

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      productType: product.productType,
      price: product.variant.price,
      compareAtPrice: product.variant.compare_at_price,
      availableForSale: product.availableForSale,
      availableQuantity: product.variant.availableQuantity,
      images,
      average_rating: product.average_rating,
      rating_count: product.rating_count,
      labels,
      subtitle,
      netContent,
      variant: product.variant,
      tags: product.tags,
    };
  }

  /**
   * Fetch collection filters with optional applied filters for updated counts.
   * Uses the data-layer's `getCollectionFilters` endpoint so the URL,
   * version selection, and auth headers stay consistent with the rest
   * of the project's API surface.
   */
  async fetchCollectionFilters(
    handle: string,
    options: {
      appliedFilters?: Array<{ filterId: string; values: string[] }>;
      signal?: AbortSignal;
    } = {}
  ): Promise<any> {
    const { appliedFilters } = options;

    const params: Record<string, string> = {
      storeId: this.storeId,
    };

    if (appliedFilters && appliedFilters.length > 0) {
      const appliedFiltersParam = appliedFilters.map((filter) => ({
        filter_id: filter.filterId,
        values: filter.values,
      }));
      params.applied_filters = JSON.stringify(appliedFiltersParam);
    }

    const response = await this.client.getCollectionFilters(
      { handle },
      { version: FILTERS_API_VERSION, params }
    );
    if (!response.success) {
      throw new Error(response.message ?? "Failed to fetch filters");
    }

    return response.data;
  }

  /**
   * Load more products (pagination)
   */
  async loadMoreProducts(
    handle: string,
    cursor: string,
    options: {
      first?: number;
      sort?: string;
      reverse?: boolean;
      filters?: Array<{ filterId: string; values: string[] }>;
    } = {}
  ): Promise<TransformedProduct[]> {
    const collection = await this.fetchCollection(handle, {
      ...options,
      after: cursor,
    });

    return collection.products;
  }
}

// Export singleton instance
export const collectionApiClient = new CollectionApiClient();
