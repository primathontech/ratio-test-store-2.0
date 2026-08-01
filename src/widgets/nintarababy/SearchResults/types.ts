import { WidgetProps } from "@/widgets/types";
import type { TransformedProduct } from "@/utils/searchService";

export type { TransformedProduct } from "@/utils/searchService";

export interface SearchResultsSettings {
  variant?: string;
  showSorting?: boolean;
  showResultsCount?: boolean;
  sortOptions?: Array<{ label: string; value: string }>;
}

export interface SearchResultsData {
  products?: TransformedProduct[];
  totalCount?: number;
}

export type SearchResultsProps = WidgetProps<
  SearchResultsData,
  SearchResultsSettings
>;
