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
      <Flex className="flex-nowrap md:!flex-wrap items-center gap-0 mb-2 md:mb-3 w-full min-w-0 max-w-full overflow-x-auto md:overflow-visible pb-1 max-h-[37px] pl-0 lg:pl-[19px]">
        {selectedValues.map((filterData, index) => (
          <div
            onClick={() =>
              onFilterRemove(filterData.filterId, filterData.optionId)
            }
            key={`${filterData.filterId}-${filterData.optionId}-${index}`}
            className="group inline-flex items-center py-1 text-sm flex-shrink-0 border-r border-faq-border mr-2.5 md:mb-[12px] pr-[15px] cursor-pointer"
          >
            <button
              type="button"
              className="flex items-center justify-center text-black md:group-hover:text-loading-blue transition-colors duration-400 w-7 h-7 rounded-full md:hover:bg-gray-100 font-extrabold"
              aria-label={`Remove ${filterData.optionLabel} filter`}
            >
              <span className="leading-none text-base relative">
                <span className="md:group-hover:opacity-0 transition-opacity duration-300">
                  ×
                </span>
                <span className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  −
                </span>
              </span>
            </button>
            <Text className="!text-sm !text-black md:group-hover:!text-loading-blue whitespace-nowrap transition-colors duration-200">
              {filterData.optionLabel.replace(
                /^(collections?-|product-type-|product-|discount-)/i,
                ""
              )}
            </Text>
          </div>
        ))}
      </Flex>
    </div>
  );
};

export default SelectedFilters;
