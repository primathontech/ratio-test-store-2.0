import { WidgetProps } from "@/widgets/types";

export interface ICollectionListImage {
  url: string;
  is_main?: boolean;
  alt?: string | null;
}

export interface ICollectionListProduct {
  id?: string;
  image_url?: string;
  images?: ICollectionListImage[];
}

export interface ICollectionListItem {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image_url?: string;
  image?: { url?: string; src?: string; altText?: string | null } | null;
  products?: ICollectionListProduct[];
  seo_title?: string;
  seo_description?: string;
  seo_handle?: string;
}

export interface ICollectionListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Data source response shape — supports:
 * - GoKwik shape: { data: [...], meta: { pagination } }
 * - Reference shape: { collections, pagination }
 * - Shopify edges shape: { edges: [{ node }] } / { nodes }
 */
export interface ICollectionListData {
  data?: ICollectionListItem[];
  collections?: ICollectionListItem[];
  edges?: Array<{ node: ICollectionListItem }>;
  nodes?: ICollectionListItem[];
  pagination?: ICollectionListPagination;
  meta?: { pagination?: ICollectionListPagination };
}

export interface CollectionListSettings {
  variant?: string;
  heading?: string;
  /** Items per page in client-side pagination. Default 6. */
  pageSize?: number;
}

export type CollectionListProps = WidgetProps<
  ICollectionListData,
  CollectionListSettings
>;
