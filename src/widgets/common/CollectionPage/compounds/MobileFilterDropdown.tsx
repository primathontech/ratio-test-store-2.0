"use client";

import { useEffect, useRef, useState } from "react";
import { ApiFilter } from "../constants";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useMobileDropdown } from "./useMobileDropdown";

interface MobileFilterDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: ApiFilter[];
  isLoading?: boolean;
  errorMessage?: string;
  resultCount?: number;
  onLocalFiltersChange?: (localFilters: Record<string, string[]>) => void;
  mobileLocalFilters?: Record<string, string[]>;
  filterTitle?: string;
  onApplyFilters?: (filters: Record<string, string[]>) => void;
  onDraftFiltersChange?: (draftFilters: Record<string, string[]>) => void;
}

export const MobileFilterDropdown = ({
  isOpen,
  onToggle,
  filters,
  isLoading = false,
  errorMessage,
  resultCount = 0,
  onLocalFiltersChange,
  mobileLocalFilters = {},
  filterTitle = "Filter",
  onApplyFilters,
  onDraftFiltersChange,
}: MobileFilterDropdownProps) => {
  console.log("Rendering MobileFilterDropdown with filters:", filters);
  const { showContent, isTextClosing, isDropdownClosing, handleClose } =
    useMobileDropdown(isOpen, onToggle);

  const mobileLocalFiltersRef = useRef(mobileLocalFilters);
  useEffect(() => {
    mobileLocalFiltersRef.current = mobileLocalFilters;
  }, [mobileLocalFilters]);

  const [draftFilters, setDraftFilters] = useState<Record<string, string[]>>(
    {}
  );

  const [selectedFilterId, setSelectedFilterId] = useState<string>(
    filters.length > 0 ? filters[0].id : ""
  );

  useEffect(() => {
    if (isOpen) {
      setDraftFilters(mobileLocalFiltersRef.current);
      if (filters.length > 0 && !selectedFilterId) {
        setSelectedFilterId(filters[0].id);
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterToggle = (filterId: string, optionValue: string) => {
    const filterOptions = draftFilters[filterId] || [];
    const isSelected = filterOptions.includes(optionValue);

    setDraftFilters((prev) => {
      const currentOptions = prev[filterId] || [];
      const newFilterOptions = isSelected
        ? currentOptions.filter((v) => v !== optionValue)
        : [...currentOptions, optionValue];

      const next = { ...prev, [filterId]: newFilterOptions };
      onDraftFiltersChange?.(next);
      return next;
    });
  };

  const handleClearAll = () => {
    setDraftFilters({});
    onDraftFiltersChange?.({});
  };

  const handleApplyAndClose = () => {
    onApplyFilters?.(draftFilters);
    onLocalFiltersChange?.(draftFilters);
    handleClose();
  };

  const isOptionSelected = (filterId: string, optionValue: string) =>
    draftFilters[filterId]?.includes(optionValue) || false;

  const hasDraftFilters = Object.values(draftFilters).some(
    (values) => values.length > 0
  );

  const appliedCount = Object.values(mobileLocalFilters).reduce(
    (total, values) => total + values.length,
    0
  );
  const hasAppliedFilters = appliedCount > 0;

  useBodyScrollLock(isOpen);

  return (
    <div data-testid="mobile-filter-dropdown-container" className="relative">
      <button
        data-testid="mobile-filter-dropdown-toggle-button"
        onClick={onToggle}
        disabled={isLoading}
        className={`flex items-center justify-between gap-[10px] p-[8px] rounded-[4px] transition-colors duration-200 border relative ${
          hasAppliedFilters
            ? "border-[#AFB7FF] bg-[#EBEDFF]"
            : "bg-white border-[#D9D9D980]"
        }`}
      >
        {appliedCount > 0 && (
          <span
            data-testid="mobile-filter-dropdown-count-badge"
            className="bg-[#DB2C20] text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1"
          >
            {appliedCount}
          </span>
        )}
        <span className="text-[12px] text-primary font-bold leading-none text-center">
          {filterTitle}
        </span>
        <div className="flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.40039 2.80002L7.00039 2.80002M1.40039 7.00002H7.00039M7.00039 7.00002V8.40002M7.00039 7.00002V5.60002M1.40039 11.2H4.20039M7.00039 11.2L12.6004 11.2M9.80039 7.00002H12.6004M9.80039 2.80002L12.6004 2.80002M9.80039 2.80002V4.20002M9.80039 2.80002V1.40002M4.55039 12.6V9.80002"
              stroke="black"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            data-testid="mobile-filter-dropdown-backdrop"
            className="fixed inset-0 transition-opacity duration-300 bg-black/80 z-2000"
            onClick={handleClose}
          />
          <div
            data-testid="mobile-filter-dropdown-bottom-sheet"
            className={`flex flex-col h-[70%] w-full fixed bottom-0 left-0 right-0 z-[3000] ${
              isDropdownClosing
                ? "animate-slide-down-slow"
                : "animate-slide-up-slow"
            }`}
          >
            <div
              data-testid="mobile-filter-dropdown-header"
              className="flex items-center justify-center pt-[10px] pb-[24px] px-4"
            >
              <button
                data-testid="mobile-filter-dropdown-close-button"
                onClick={handleClose}
                className="flex items-center justify-center text-black"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.4894 3.51063C15.8086 -1.17014 8.19199 -1.1706 3.51076 3.51063C-1.17048 8.19187 -1.17002 15.808 3.51076 20.4892C8.19153 25.1705 15.8081 25.1705 20.4894 20.4892C25.1701 15.808 25.1701 8.19141 20.4894 3.51063ZM16.7344 16.7343C16.3738 17.0949 15.7892 17.0949 15.4286 16.7343L12.0001 13.3058L8.40855 16.8973C8.04792 17.2579 7.46335 17.2579 7.10272 16.8973C6.74209 16.5366 6.74209 15.9521 7.10272 15.5914L10.6942 11.9999L7.26572 8.57143C6.90509 8.2108 6.90509 7.62576 7.26572 7.2656C7.62635 6.90497 8.21092 6.90497 8.57155 7.2656L12.0001 10.6941L15.2651 7.42906C15.6257 7.06843 16.2103 7.06843 16.5709 7.42906C16.9316 7.78968 16.9316 8.37426 16.5709 8.73489L13.3059 11.9999L16.7344 15.4284C17.095 15.7891 17.095 16.3736 16.7344 16.7343Z"
                    fill="#CCCCCC"
                  />
                </svg>
              </button>
            </div>

            <div
              data-testid="mobile-filter-dropdown-content"
              className="flex-1 flex flex-col bg-white rounded-t-[4px] min-h-0"
            >
              <div
                data-testid="mobile-filter-dropdown-content-header"
                className="flex-shrink-0"
              >
                <h2
                  data-testid="mobile-filter-dropdown-content-title"
                  className="text-[16px] text-primary leading-none p-[16px] pt-[24px] border-b border-[#DDD]"
                >
                  Filters
                </h2>
              </div>

              <div
                data-testid="mobile-filter-dropdown-options-container"
                className={`flex-1 min-h-0 ${
                  showContent
                    ? "animate-fade-in-delayed opacity-100"
                    : isTextClosing
                      ? "animate-fade-out-quick opacity-0"
                      : "opacity-0"
                }`}
              >
                <div
                  data-testid="mobile-filter-dropdown-two-column-layout"
                  className="flex h-full"
                >
                  <div
                    data-testid="mobile-filter-dropdown-left-column"
                    className="flex-shrink-0 w-[45%] min-w-[45%] bg-[#F4F6F8] border-r border-[#DDD] overflow-y-auto"
                  >
                    {filters.map((filter) => {
                      const selectedCount =
                        draftFilters[filter.id]?.length || 0;
                      const shouldShowCount =
                        Object.prototype.hasOwnProperty.call(
                          draftFilters,
                          filter.id
                        );
                      return (
                        <button
                          key={filter.id}
                          data-testid={`mobile-filter-dropdown-filter-name-${filter.id}`}
                          onClick={() => setSelectedFilterId(filter.id)}
                          className={`w-full text-left py-[8px] px-[16px] border-b border-[#DDD] transition-colors text-[14px] text-primary leading-[18px] flex items-center justify-between ${
                            selectedFilterId === filter.id
                              ? "bg-white font-bold"
                              : "bg-transparent font-normal"
                          }`}
                        >
                          <span
                            data-testid={`mobile-filter-dropdown-filter-label-${filter.id}`}
                          >
                            {filter.filter_label}
                          </span>
                          {shouldShowCount && (
                            <span
                              data-testid={`mobile-filter-dropdown-filter-count-${filter.id}`}
                            >
                              {selectedCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    data-testid="mobile-filter-dropdown-right-column"
                    className="flex-1 overflow-y-auto"
                  >
                    <div
                      data-testid="mobile-filter-dropdown-options-wrapper"
                      className="p-[16px]"
                    >
                      <div
                        data-testid="mobile-filter-dropdown-options-list"
                        className="space-y-[16px]"
                      >
                        {filters
                          .find((filter) => filter.id === selectedFilterId)
                          ?.values.map((value, index) => (
                            <label
                              key={`${selectedFilterId}-${index}`}
                              data-testid={`mobile-filter-dropdown-option-${selectedFilterId}-${index}`}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isOptionSelected(
                                  selectedFilterId,
                                  value.value
                                )}
                                onChange={() =>
                                  handleFilterToggle(
                                    selectedFilterId,
                                    value.value
                                  )
                                }
                                className="sr-only"
                              />
                              <div
                                data-testid={`mobile-filter-dropdown-option-checkbox-${selectedFilterId}-${index}`}
                                className={`size-[18px] flex-shrink-0 border rounded-[2px] flex items-center justify-center transition-colors mr-[8px] ${
                                  isOptionSelected(
                                    selectedFilterId,
                                    value.value
                                  )
                                    ? "bg-primary border-primary"
                                    : "border-[#A3A3A3]"
                                }`}
                              >
                                {isOptionSelected(
                                  selectedFilterId,
                                  value.value
                                ) && (
                                  <svg
                                    data-testid={`mobile-filter-dropdown-option-checkmark-${selectedFilterId}-${index}`}
                                    className="size-[14px] text-white"
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
                              <span
                                data-testid={`mobile-filter-dropdown-option-label-${selectedFilterId}-${index}`}
                                className="text-[14px] text-primary leading-[18px]"
                              >
                                {value.value}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                data-testid="mobile-filter-dropdown-footer"
                className="flex justify-between p-[16px] shadow-[0_-4px_8px_0_rgba(0,0,0,0.08)]"
              >
                <button
                  data-testid="mobile-filter-dropdown-clear-all-button"
                  onClick={handleClearAll}
                  disabled={!hasDraftFilters}
                  className={`transition-colors tracking-[-0.194px] text-[16px] leading-none ${
                    hasDraftFilters
                      ? "text-primary font-bold"
                      : "text-[#A3A3A3] cursor-not-allowed font-normal"
                  }`}
                >
                  Clear all
                </button>
                <button
                  data-testid="mobile-filter-dropdown-show-results-button"
                  onClick={handleApplyAndClose}
                  className="basis-[55%] flex justify-center items-center py-[14.5px] rounded-[4px] bg-primary text-white hover:bg-gray-800 transition-colors tracking-[-0.194px] text-[16px] leading-none font-bold"
                >
                  Show {resultCount} results
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {errorMessage && (
        <div
          data-testid="mobile-filter-dropdown-error"
          className="fixed bottom-4 left-4 right-4 text-sm text-red-600 bg-white px-4 py-2 rounded-lg shadow border"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};
