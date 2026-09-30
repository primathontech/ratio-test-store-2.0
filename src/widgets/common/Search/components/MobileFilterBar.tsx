"use client";

import React from "react";
import { Box, Heading, Text, Checkbox, Flex, Button } from "@/ui/atomic";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

function isDisplayableOption(option: any): boolean {
  if (option == null) {
    return false;
  }
  const label = String(option.label ?? "").trim();
  const id = String(option.id ?? "").trim();
  return label !== "" && id !== "";
}

interface MobileFilterBarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
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
  className?: string;
  settings?: {
    filterText?: string;
    clearAllText?: string;
    closeText?: string;
    applyText?: string;
    noOptionsAvailableText?: string;
  };
}

const MobileFilterBar: React.FC<MobileFilterBarProps> = ({
  isOpen,
  onClose,
  onApply,
  textFacets = {},
  numericFacets = {},
  onFilterChange,
  onClearAll,
  selectedFilters: externalSelectedFilters,
  dynamicFilters: externalDynamicFilters,
  clearAllFilters: externalClearAllFilters,
  className = "",
  settings = {},
}) => {
  useBodyScrollLock(isOpen);

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

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 transition-opacity duration-300"
        onClick={onClose}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10,
        }}
      />
      <Box
        className={`fixed inset-0 bg-white flex flex-col min-[769px]:hidden z-[9600] ${className}`}
      >
        <Flex className="items-center !justify-between py-4 px-[20px] bg-surface-4">
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-[18px] !text-black mr-2.5 font-medium"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="6" y1="12" x2="18" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            <Heading className="!text-black !tracking-[1px] !font-medium !text-xs flex items-center justify-center">
              {settings.filterText || "FILTER"}
            </Heading>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              aria-label={settings.clearAllText || "Remove all filters"}
              className="group relative inline-flex items-center text-black py-[3px] rounded-[15px] pl-[25px] pr-[15px] text-sm font-normal transition-colors duration-500 hover:bg-[#1a1a1a]"
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

        <Box className="flex-1 overflow-y-auto">
          <Box className="pl-4 pr-1.5 pb-[150px]">
            {dynamicFilters
              .filter((filter) => filter.values && filter.values.length > 0)
              .map((filter) => (
                <Box
                  key={filter.id}
                  className="mb-1 border-b border-faq-border"
                >
                  <button
                    onClick={() => toggleSection(filter.id)}
                    className="w-full flex items-center justify-between text-left pt-4 focus:outline-none mb-5"
                  >
                    <Text className="!text-black !text-base !font-medium">
                      {filter.label}
                    </Text>
                    {collapsedSections[filter.id] ? (
                      <svg
                        viewBox="0 0 600 500"
                        width="12"
                        height="12"
                        fill="#000"
                        className="mr-2.5"
                      >
                        <path d="m275.565 361.679-223.897-223.896h-51.668l275.565 275.565 275.565-275.565h-51.668z" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 600 500"
                        width="12"
                        height="12"
                        fill="#000"
                        className="mr-2.5"
                      >
                        <path d="m275.565 189.451 223.897 223.897h51.668l-275.565-275.565-275.565 275.565h51.668z" />
                      </svg>
                    )}
                  </button>

                  {!collapsedSections[filter.id] && (
                    <Box className="my-2.5 pr-2.5">
                      {filter.values.length > 0 ? (
                        <div
                          className="max-h-[200px] overflow-y-auto"
                          style={{ scrollbarWidth: "none" }}
                        >
                          {filter.values
                            .filter((option: any) =>
                              isDisplayableOption(option)
                            )
                            .map((option: any) => (
                              <Flex
                                key={option.id}
                                className="items-start justify-between cursor-pointer"
                                onClick={() =>
                                  handleFilterChange(
                                    filter.id,
                                    option.id,
                                    !selectedFilters[option.id],
                                    option
                                  )
                                }
                              >
                                <Flex className="flex-1 gap-2 justify-center items-center py-2 leading-[16px]">
                                  <Checkbox
                                    checked={
                                      selectedFilters[option.id] || false
                                    }
                                    onCheckedChange={(checked) =>
                                      handleFilterChange(
                                        filter.id,
                                        option.id,
                                        checked as boolean,
                                        option
                                      )
                                    }
                                    className="mt-0.5 mr-3 !border !border-faq-border !w-4 md:!w-6 !h-4 md:!h-6 data-[state=checked]:!bg-loading-blue data-[state=checked]:!text-white pointer-events-none flex items-center justify-center [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span>svg]:!w-3 [&>span>svg]:!h-3 md:[&>span>svg]:!w-5 md:[&>span>svg]:!h-5"
                                  />
                                  <Text className="!text-[17px] !text-black !font-medium flex-1 leading-5 pointer-events-none">
                                    {option.label}
                                  </Text>
                                </Flex>
                                {filter.id !== "availability" && (
                                  <Text className="!text-black ml-2 mt-0.5 pointer-events-none !text-[17px] !font-medium">
                                    ({option.count})
                                  </Text>
                                )}
                              </Flex>
                            ))}
                        </div>
                      ) : (
                        <Text size="sm" className="text-gray-400 italic">
                          {settings.noOptionsAvailableText ||
                            "No options available"}
                        </Text>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        </Box>

        <Box className="p-[5px] border-t border-gray-200 bg-white">
          <Flex className="gap-3">
            <Button
              onClick={onClose}
              className="flex-1 !rounded-none !text-sm !bg-[#ff5b6f] !text-white !font-normal py-[7px]"
            >
              {settings.applyText || "Apply"}
            </Button>
            <Button
              onClick={onApply}
              className="flex-1 !rounded-none !text-sm !bg-black text-white !font-normal py-[7px]"
            >
              {settings.closeText || "Close"}
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default MobileFilterBar;
