/**
 * Collection widget provider types
 */

export interface FilterValue {
  id: string;
  label: string;
  count?: number;
}

export interface Filter {
  id: string;
  label: string;
  type: "list" | "range" | "boolean";
  values: FilterValue[];
}

export interface SortOption {
  label: string;
  value: string;
}

export interface ProviderState {
  products: any[];
  isLoading: boolean;
  hasMore: boolean;
  totalCount: number;
  filters: Filter[];
  selectedFilters: Record<string, string[]>;
  sortBy: string;
  page: number;
}

export type TAction =
  | "SET_PRODUCTS"
  | "SET_LOADING"
  | "SET_FILTERS"
  | "APPLY_FILTER"
  | "REMOVE_FILTER"
  | "CLEAR_FILTERS"
  | "SET_SORT"
  | "LOAD_MORE"
  | "RESET";

export interface IActionPayload {
  products?: any[];
  isLoading?: boolean;
  filters?: Filter[];
  filterId?: string;
  filterValue?: string;
  sortBy?: string;
  page?: number;
}

export interface IFeedback {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export default {
  ProviderState: {} as ProviderState,
  TAction: "" as TAction,
  IActionPayload: {} as IActionPayload,
  IFeedback: {} as IFeedback,
};
