import { IFilter } from "../base/provider/type";

/**
 * Convert internal filter format to API filter format
 * Internal: IFilter[] with type and values
 * API: Array<{filterId: string, values: string[]}>
 */
export function convertFiltersToApiFormat(
  filters: IFilter[]
): Array<{ filterId: string; values: string[] }> {
  return filters.map((filter) => ({
    filterId: filter.id,
    values: filter.values.map((value) => value.label),
  }));
}

/**
 * Convert API filter response to internal filter format for UI
 */
export function convertApiFiltersToInternal(apiFilters: any[]): any[] {
  if (!apiFilters || !Array.isArray(apiFilters)) {
    return [];
  }

  return apiFilters.map((filter) => ({
    id: filter.id,
    filter_label: filter.filter_label,
    source_type: filter.source_type,
    values: filter.values || [],
    position: filter.position || 1,
    sort_order: filter.sort_order || "manually",
  }));
}
