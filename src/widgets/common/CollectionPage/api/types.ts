// API Response Types for the new collection API

import type { ProductImage } from "../../Search/types";

export interface CollectionImage {
  src: string;
  altText: string;
  isMain: boolean;
}

export interface PriceRange {
  maxVariantPrice: {
    amount: string;
    currencyCode: string;
  };
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  availableForSale: boolean;
  availableQuantity: number;
  sku?: string;
  metadata: Record<string, any>;
}

export interface ProductMetadata {
  disclaimer?: {
    value: string[];
    data_type: string;
  };
  manufacturer?: {
    value: string;
    data_type: string;
  };
  product_labels?: {
    value: string;
    data_type: string;
  };
  product_net_content?: {
    value: string;
    data_type: string;
  };
  product_subtitle?: {
    value: string;
    data_type: string;
  };
  reasons_to_love_image?: {
    value: any[];
    data_type: string;
  };
  trust_badges?: {
    value: string[];
    data_type: string;
  };
  rating?: {
    value: string;
    data_type: string;
  };
  rating_count?: {
    value: string;
    data_type: string;
  };
  product_details?: {
    value: Array<{ fields: Record<string, any> }>;
    data_type: string;
  };
  product_faq?: {
    value: Array<{ fields: Record<string, any> }>;
    data_type: string;
  };
  variants?: {
    value: Array<{ fields: Record<string, any> }>;
    data_type: string;
  };
}

export interface ProductNode {
  id: string;
  title: string;
  handle: string;
  productType: string;
  priceRange: PriceRange;
  compareAtPriceRange: PriceRange;
  product_availability: boolean;
  availableForSale: boolean;
  variant: ProductVariant | null;
  metadata: ProductMetadata;
  average_rating: string;
  rating_count: string;
  images: {
    edges: Array<{
      node: CollectionImage;
    }>;
  };
  tags: string[];
}

export interface ProductEdge {
  cursor: string;
  node: ProductNode;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  productCount: number;
}

export interface CollectionProducts {
  productCount: number;
  edges: ProductEdge[];
  pageInfo: PageInfo;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: CollectionImage;
  seo_title: string;
  seo_description: string | null;
  seo_url_handle: string;
  metadata: Record<string, any>;
  products: CollectionProducts;
}

export interface CollectionApiResponse {
  data: {
    data: {
      collectionByHandle: Collection;
    };
  };
}

// Transformed types for easier use in components
export interface TransformedProduct {
  id: string;
  title: string;
  handle: string;
  productType: string;
  price: number;
  compareAtPrice: number | null;
  availableForSale: boolean;
  availableQuantity: number;
  images: ProductImage[];
  average_rating: string;
  rating_count: string;
  labels: string[];
  subtitle: string;
  variant: ProductVariant | null;
  netContent: string;
  tags: string[];
}

export interface TransformedCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  products: TransformedProduct[];
  productCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}
