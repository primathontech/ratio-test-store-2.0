import React from "react";
import { Flex, Text } from "@/ui/atomic";
import {
  FILTER_ID,
  AVAILABILITY_OPTION_ID,
} from "../constants/search-constants";

interface SelectedFiltersProps {
  selectedFilters: Record<string, boolean>;
  dynamicFilters: Array<{
    id: string;
    label: string;
    values: Array<{
      id: string;
      label: string;
      apiValue?: string;
    }>;
  }>;
  onFilterRemove: (filterId: string, optionId: string) => void;
  onClearAll: () => void;
  clearAllLabel?: string;
  className?: string;
}

export const SelectedFilters: React.FC<SelectedFiltersProps> = ({
  selectedFilters,
  dynamicFilters,
  onFilterRemove,
  onClearAll,
  clearAllLabel = "Remove all",
  className = "",
}) => {
  const selectedValues = Object.entries(selectedFilters)
    .filter(([, value]) => value === true)
    .filter(
      ([key]) =>
        !key.toLowerCase().includes(FILTER_ID.AVAILABILITY) &&
        !key
          .toLowerCase()
          .includes(AVAILABILITY_OPTION_ID.EXCLUDE_OUT_OF_STOCK) &&
        !key.toLowerCase().includes(AVAILABILITY_OPTION_ID.INCLUDE_OUT_OF_STOCK)
    )
    .map(([key]) => {
      let optionLabel = key;
      let filterId = "filter";
      let filterLabel = "Filter";

      for (const filter of dynamicFilters) {
        const option = filter.values.find((val) => val.id === key);
        if (option) {
          optionLabel = option.label;
          filterId = filter.id;
          filterLabel = filter.label;
          break;
        }
      }

      return {
        filterId,
        filterLabel,
        optionId: key,
        optionLabel,
      };
    });

  if (selectedValues.length === 0) {
    return null;
  }

  return (
    <div className={`selected-filters w-full min-w-0 max-w-full ${className}`}>
      <Flex className="flex-nowrap md:!flex-wrap items-center gap-2 mb-4 w-full min-w-0 max-w-full overflow-x-auto md:overflow-visible pb-1">
        {selectedValues.map((filterData, index) => (
          <div
            onClick={() =>
              onFilterRemove(filterData.filterId, filterData.optionId)
            }
            key={`${filterData.filterId}-${filterData.optionId}-${index}`}
            className="group inline-flex items-center gap-2 py-1 text-sm flex-shrink-0 border-l border-r border-faq-border mr-[10px] md:mb-[15px] px-[15px] cursor-pointer"
          >
            <button
              type="button"
              className="flex items-center justify-center text-black md:group-hover:text-loading-blue transition-colors duration-400 w-7 h-7 rounded-full md:hover:bg-gray-100 font-extrabold"
              aria-label={`Remove ${filterData.optionLabel} filter`}
            >
              <span className="leading-none text-[16px] relative">
                <span className="md:group-hover:opacity-0 transition-opacity duration-300">
                  ×
                </span>
                <span className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  −
                </span>
              </span>
            </button>
            <Text className="!text-[14px] !text-black md:group-hover:!text-loading-blue whitespace-nowrap transition-colors duration-200">
              {filterData.optionLabel.replace(
                /^(collections?-|product-type-|product-|discount-)/i,
                ""
              )}
            </Text>
          </div>
        ))}

        <button
          type="button"
          onClick={onClearAll}
          aria-label={clearAllLabel}
          className="group relative inline-flex items-center text-white py-[3px] bg-black rounded-[15px] pl-[25px] pr-[15px] text-[14px] font-medium transition-colors duration-500 hover:bg-[#1a1a1a] flex-shrink-0 md:mb-[15px]"
        >
          <span className="absolute left-[10px] top-1/2 -translate-y-1/2 leading-none text-[16px] font-semibold">
            <span className="block transition-opacity duration-300 group-hover:opacity-0 font-extrabold">
              ×
            </span>
            <span className="absolute inset-0 block opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              −
            </span>
          </span>
          {clearAllLabel}
        </button>
      </Flex>
    </div>
  );
};

export default SelectedFilters;
