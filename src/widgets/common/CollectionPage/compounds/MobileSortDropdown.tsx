import React from "react";
import { useMobileDropdown } from "./useMobileDropdown";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

interface SortOption {
  id: string;
  label: string;
  value: string;
  order: string;
}

interface MobileSortDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  options: SortOption[];
  selectedSort: string;
  onSortChange: (value: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
  currentSortLabel: string;
  sortDropdownText?: string;
}

export const MobileSortDropdown = ({
  isOpen,
  onToggle,
  options,
  selectedSort,
  onSortChange,
  isLoading = false,
  errorMessage,
  sortDropdownText = "Sort by",
}: MobileSortDropdownProps) => {
  const { showContent, isTextClosing, isDropdownClosing, handleClose } =
    useMobileDropdown(isOpen, onToggle);

  useBodyScrollLock(isOpen);

  return (
    <div data-testid="mobile-sort-dropdown-container" className="relative">
      <button
        data-testid="mobile-sort-dropdown-toggle-button"
        onClick={onToggle}
        disabled={isLoading}
        className={`flex items-center justify-between gap-[8px] p-[8px] rounded-[4px] transition-colors duration-200 text-left max-w-[82px] border ${
          selectedSort && selectedSort !== "featured" && selectedSort !== ""
            ? "border-[#AFB7FF] bg-[#EBEDFF]"
            : "bg-white border-[#D9D9D980]"
        }`}
      >
        <span className="text-[12px] text-primary whitespace-nowrap font-medium leading-none text-center">
          {sortDropdownText}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.84118 3.86594H12.8337M7.84118 6.67456H11.4072M7.84118 9.48318H9.98081M3.38695 3.5V10.5M3.38695 10.5L1.16699 8.36017M3.38695 10.5L5.69168 8.36017"
            stroke="black"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            data-testid="mobile-sort-dropdown-backdrop"
            className="fixed inset-0 transition-opacity duration-300 bg-black/80 z-2000"
            onClick={handleClose}
          />
          <div
            data-testid="mobile-sort-dropdown-bottom-sheet"
            className={`fixed bottom-0 left-0 right-0 rounded-t-lg z-[3000] ${
              isDropdownClosing
                ? "animate-slide-down-slow"
                : "animate-slide-up-slow"
            }`}
          >
            <div
              data-testid="mobile-sort-dropdown-header"
              className="flex items-center justify-center pt-4 pb-[24px]"
            >
              <button
                data-testid="mobile-sort-dropdown-close-button"
                onClick={handleClose}
                className="p-4 flex items-center justify-center border border-grey rounded-full hover:bg-grey transition-colors bg-white"
              >
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              data-testid="mobile-sort-dropdown-options-container"
              className="max-h-[68vh] overflow-y-auto bg-white py-[15px] rounded-lg"
            >
              <div
                data-testid="mobile-sort-dropdown-options-list"
                className={`${
                  showContent
                    ? "animate-fade-in-delayed opacity-100"
                    : isTextClosing
                      ? "animate-fade-out-quick opacity-0"
                      : "opacity-0"
                }`}
              >
                {options.map((option) => {
                  const isActiveSort = selectedSort === option.id;

                  return (
                    <label
                      key={option.id}
                      data-testid={`mobile-sort-dropdown-option-${option.id}`}
                      className="flex items-center px-[20px] my-[13px] hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <div
                        data-testid={`mobile-sort-dropdown-option-content-${option.id}`}
                        className="flex items-center"
                      >
                        <input
                          type="radio"
                          name="sort-option"
                          checked={isActiveSort}
                          onChange={() => onSortChange(option.id)}
                          className="sr-only"
                        />
                        <div
                          data-testid={`mobile-sort-dropdown-radio-${option.id}`}
                          className="size-[20px] rounded-full border border-black flex items-center justify-center transition-colors"
                        >
                          {isActiveSort && (
                            <div
                              data-testid={`mobile-sort-dropdown-radio-indicator-${option.id}`}
                              className="size-[12px] bg-black rounded-full"
                            />
                          )}
                        </div>
                        <span
                          data-testid={`mobile-sort-dropdown-option-label-${option.id}`}
                          className={`ml-3 text-[14px] leading-[30px] font-medium ${isActiveSort ? "text-black" : "text-[#545454]"}`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {errorMessage && (
        <div
          data-testid="mobile-sort-dropdown-error"
          className="fixed bottom-4 left-4 right-4 text-sm text-red-600 bg-white px-4 py-2 rounded-lg shadow border"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};
