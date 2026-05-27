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
        className={`flex items-center justify-between gap-2 p-2 rounded transition-colors duration-200 text-left max-w-[82px] border ${
          selectedSort && selectedSort !== "featured" && selectedSort !== ""
            ? "border-[#AFB7FF] bg-[#EBEDFF]"
            : "bg-white border-[#D9D9D980]"
        }`}
      >
        <span className="text-xs text-primary whitespace-nowrap font-medium leading-none text-center">
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
            className="fixed inset-0 transition-opacity duration-300 bg-[#000000]/80 z-[2000]"
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
              className="flex items-center justify-center pt-4 pb-6"
            >
              <button
                data-testid="mobile-sort-dropdown-close-button"
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
                      className="flex items-center px-5 my-[13px] hover:bg-gray-50 cursor-pointer transition-colors duration-150"
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
                          className="size-5 rounded-full border border-black flex items-center justify-center transition-colors"
                        >
                          {isActiveSort && (
                            <div
                              data-testid={`mobile-sort-dropdown-radio-indicator-${option.id}`}
                              className="size-3 bg-black rounded-full"
                            />
                          )}
                        </div>
                        <span
                          data-testid={`mobile-sort-dropdown-option-label-${option.id}`}
                          className={`ml-3 text-sm leading-[30px] font-medium ${isActiveSort ? "text-black" : "text-[#545454]"}`}
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
