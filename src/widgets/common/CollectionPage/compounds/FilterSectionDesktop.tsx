"use client";

import React, { useEffect, useState } from "react";

export interface ApiFilterValue {
  value: string;
  count: number;
  options?: string[];
}

export interface ApiFilter {
  id: string;
  filter_label: string;
  source_type: string;
  values: ApiFilterValue[];
  position: number;
  sort_order: string;
}

interface FilterSectionProps {
  filters: ApiFilter[];
  onFilterChange?: (
    filterId: string,
    optionValue: string,
    checked: boolean
  ) => void;
  filterTitle: string;
}

export const FilterSectionDesktop: React.FC<FilterSectionProps> = ({
  filters,
  filterTitle,
  onFilterChange,
}) => {
  console.log("Rendering FilterSectionDesktop with filters:", filters);
  const [filterState, setFilterState] = useState<{
    expanded: Set<string>;
    selected: Record<string, Set<string>>;
  }>({
    expanded: new Set(),
    selected: {},
  });

  const handleFilterToggle = (filterId: string, optionValue: string) => {
    setFilterState((prev) => {
      const filterOptions = prev.selected[filterId] || new Set<string>();
      const newFilterOptions = new Set(filterOptions);
      const isSelected = newFilterOptions.has(optionValue);

      if (isSelected) {
        newFilterOptions.delete(optionValue);
      } else {
        newFilterOptions.add(optionValue);
      }

      onFilterChange?.(filterId, optionValue, !isSelected);

      return {
        ...prev,
        selected: {
          ...prev.selected,
          [filterId]: newFilterOptions,
        },
      };
    });
  };

  const toggleFilterExpansion = (filterId: string) => {
    setFilterState((prev) => {
      const newExpanded = new Set(prev.expanded);
      if (newExpanded.has(filterId)) {
        newExpanded.delete(filterId);
      } else {
        newExpanded.add(filterId);
      }
      return { ...prev, expanded: newExpanded };
    });
  };

  useEffect(() => {
    if (filters.length === 0) {
      return;
    }

    setFilterState((prev) => {
      if (prev.expanded.size > 0) {
        return prev;
      }
      return {
        ...prev,
        expanded: new Set(filters.map((filter) => filter.id)),
      };
    });
  }, [filters]);

  return (
    <div className="w-full rounded-2xl ring-1 ring-black/[0.06] bg-white shadow-sm p-5">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1D1D1D] mb-6 pb-4 border-b border-neutral-200">
        {filterTitle}
      </h2>

      <div
        data-testid="filter-section-desktop-filters-list"
        className="space-y-6"
      >
        {filters.map((filter) => {
          const isExpanded = filterState.expanded.has(filter.id);
          const selectedCount = filterState.selected[filter.id]?.size || 0;

          return (
            <div
              key={filter.id}
              data-testid={`filter-section-desktop-filter-${filter.id}`}
              className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0"
            >
              <div
                data-testid={`filter-section-desktop-filter-header-${filter.id}`}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFilterExpansion(filter.id)}
              >
                <div
                  data-testid={`filter-section-desktop-filter-header-content-${filter.id}`}
                  className="flex items-center gap-2"
                >
                  <h3
                    data-testid={`filter-section-desktop-filter-label-${filter.id}`}
                    className="text-base font-semibold tracking-tight text-[#1D1D1D]"
                  >
                    {filter.filter_label}
                  </h3>
                  {selectedCount > 0 && (
                    <span
                      data-testid={`filter-section-desktop-filter-count-${filter.id}`}
                      className="bg-black text-white text-[10px] rounded-full size-4 flex items-center justify-center font-bold"
                    >
                      {selectedCount}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ease-linear ${
                    isExpanded ? "-rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div
                data-testid={`filter-section-desktop-filter-options-container-${filter.id}`}
                className={`overflow-hidden transition-all duration-300 ease-linear ${
                  isExpanded
                    ? "max-h-fit opacity-100 mt-5"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div
                  data-testid={`filter-section-desktop-filter-options-list-${filter.id}`}
                  className="space-y-4 pt-1 max-h-[unset]"
                >
                  {filter.values.map((value, index) => {
                    const optionId = `${filter.id}_${index}`;
                    const isSelected =
                      filterState.selected[filter.id]?.has(value.value) ||
                      false;

                    const hasSelectedFiltersFromOtherCategories = Object.keys(
                      filterState.selected
                    ).some(
                      (selectedFilterId) =>
                        selectedFilterId !== filter.id &&
                        (filterState.selected[selectedFilterId]?.size || 0) > 0
                    );

                    const isDisabled =
                      value.count === 0 &&
                      hasSelectedFiltersFromOtherCategories &&
                      !isSelected;

                    return (
                      <label
                        key={optionId}
                        data-testid={`filter-section-desktop-filter-option-${optionId}`}
                        className={`flex items-center gap-3 group ${
                          isDisabled
                            ? "cursor-not-allowed opacity-20"
                            : "cursor-pointer"
                        }`}
                      >
                        <div
                          data-testid={`filter-section-desktop-filter-option-checkbox-wrapper-${optionId}`}
                          className="relative"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() =>
                              !isDisabled &&
                              handleFilterToggle(filter.id, value.value)
                            }
                            className="sr-only"
                          />
                          <div
                            data-testid={`filter-section-desktop-filter-option-checkbox-${optionId}`}
                            className={`size-[18px] border rounded flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-[#1D1D1D] border-[#1D1D1D]"
                                : "border-neutral-300 group-hover:border-neutral-400"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                data-testid={`filter-section-desktop-filter-option-checkmark-${optionId}`}
                                className="size-[13.5px] text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span
                          data-testid={`filter-section-desktop-filter-option-label-${optionId}`}
                          className="text-sm font-medium text-[#1D1D1D] group-hover:text-neutral-600"
                        >
                          {value.value}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
