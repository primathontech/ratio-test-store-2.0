import type { TransformedProduct } from "@/utils/searchService";

export const DEFAULT_SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function sortProducts(
  products: TransformedProduct[],
  sortBy: string
): TransformedProduct[] {
  const sorted = [...products];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "relevance":
    default:
      return sorted;
  }
}
