"use client";

import React from "react";
import { Box, Checkbox, Flex, Heading, Text } from "@/ui/atomic";
import { useSearchFilter } from "../hooks/useSearchFilter";

function isDisplayableOption(option: any): boolean {
  if (option == null) {
    return false;
  }
  const label = String(option.label ?? "").trim();
  const id = String(option.id ?? "").trim();
  return label !== "" && id !== "";
}

interface FilterSideBarProps {
  className?: string;
  textFacets?: Record<string, any>;
  numericFacets?: Record<string, any>;
  onFilterChange?: (
    filterId: string,
    optionId: string,
    checked: boolean,
    option?: any
  ) => void;
  onClearAll?: () => void;
  selectedFilters?: Record<string, boolean>;
  dynamicFilters?: any[];
  clearAllFilters?: () => void;
  settings?: {
    filterByText?: string;
    clearAllText?: string;
  };
}

const FilterSideBar: React.FC<FilterSideBarProps> = ({
  className = "",
  textFacets = {},
  numericFacets = {},
  onFilterChange,
  onClearAll,
  selectedFilters: externalSelectedFilters,
  dynamicFilters: externalDynamicFilters,
  clearAllFilters: externalClearAllFilters,
  settings = {},
}) => {
  const hookData = useSearchFilter({
    textFacets,
    numericFacets,
    onFilterChange,
    onClearAll,
  });

  const dynamicFilters = externalDynamicFilters || hookData.dynamicFilters;
  const selectedFilters = externalSelectedFilters || hookData.selectedFilters;
  const clearAllFilters = externalClearAllFilters || hookData.clearAllFilters;
  const handleFilterChange = onFilterChange || hookData.handleFilterChange;
  const collapsedSections = hookData.collapsedSections;
  const toggleSection = hookData.toggleSection;
  const hasActiveFilters = Object.values(selectedFilters).some(Boolean);

  return (
    <Box
      className={`w-auto min-w-0 xl:min-w-[280px] bg-white h-full overflow-y-auto pr-[30px] ${className}`}
    >
      <Box>
        <Flex className="items-center !justify-between py-[14.5px]">
          <Heading size="2xl" className="!text-xs !text-black !font-semibold">
            {settings.filterByText || "FILTER"}
          </Heading>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              aria-label={settings.clearAllText || "Remove all filters"}
              className="group relative inline-flex items-center text-white py-0 lg:py-[3px] bg-black rounded-[15px] pl-[25px] pr-[15px] text-[11px] lg:text-sm font-medium transition-colors duration-500 hover:bg-[#1a1a1a] max-h-[22.4px]"
            >
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 leading-none text-base font-semibold">
                <span className="block transition-opacity duration-300 group-hover:opacity-0 font-extrabold">
                  ×
                </span>
                <span className="absolute inset-0 block opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  −
                </span>
              </span>
              {settings.clearAllText || "Remove all"}
            </button>
          )}
        </Flex>

        {dynamicFilters
          .filter((filter) => filter.values && filter.values.length > 0)
          .map((filter) => (
            <Box key={filter.id} className="border-b border-faq-border">
              <button
                onClick={() => toggleSection(filter.id)}
                className={`w-full flex items-center justify-between pt-5 ${collapsedSections[filter.id] ? "pb-5" : "pb-[6px]"}`}
              >
                <Text weight="normal" className="!text-black !text-xl">
                  {filter.label}
                </Text>
                {collapsedSections[filter.id] ? (
                  <svg viewBox="0 0 600 500" width="12" height="12" fill="#000">
                    <path d="m275.565 361.679-223.897-223.896h-51.668l275.565 275.565 275.565-275.565h-51.668z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 600 500" width="12" height="12" fill="#000">
                    <path d="m275.565 189.451 223.897 223.897h51.668l-275.565-275.565-275.565 275.565h51.668z" />
                  </svg>
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  collapsedSections[filter.id]
                    ? "max-h-0 opacity-0"
                    : "max-h-[300px] opacity-100"
                }`}
              >
                <Box className="my-[7px]">
                  {filter.values.length > 0 && (
                    <div className="max-h-[200px] my-[10px] overflow-y-auto pr-[7px] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-loading-blue [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
                      {filter.values
                        .filter((option: any) => isDisplayableOption(option))
                        .map((option: any) => (
                          <Flex
                            key={option.id}
                            className="!items-center !justify-between pb-2.5 cursor-pointer"
                            onClick={() =>
                              handleFilterChange(
                                filter.id,
                                option.id,
                                !selectedFilters[option.id],
                                option
                              )
                            }
                          >
                            <Flex className="!items-center">
                              <Checkbox
                                checked={selectedFilters[option.id] || false}
                                onCheckedChange={(checked) =>
                                  handleFilterChange(
                                    filter.id,
                                    option.id,
                                    checked as boolean,
                                    option
                                  )
                                }
                                className="mr-3 !w-4 !h-4 !border !border-faq-border data-[state=checked]:!bg-loading-blue data-[state=checked]:!border-faq-border data-[state=checked]:!text-white pointer-events-none [&>span>svg]:!w-3.5 [&>span>svg]:!h-3.5"
                              />
                              <Text className="!text-black pointer-events-none !text-sm !font-medium">
                                {option.label}
                              </Text>
                            </Flex>
                            {filter.id !== "availability" && (
                              <Text className="!text-black !text-sm pointer-events-none !font-medium">
                                ({option.count})
                              </Text>
                            )}
                          </Flex>
                        ))}
                    </div>
                  )}
                </Box>
              </div>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default FilterSideBar;
