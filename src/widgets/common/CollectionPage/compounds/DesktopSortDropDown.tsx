import React from "react";

interface SortOption {
  id: string;
  label: string;
  value: string;
  order: string;
}

interface DesktopSortDropdownProps {
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

export const DesktopSortDropdown = ({
  isOpen,
  onToggle,
  options,
  selectedSort,
  onSortChange,
  isLoading = false,
  errorMessage,
  sortDropdownText = "Sort by",
}: DesktopSortDropdownProps) => {
  return (
    <div
      data-testid="desktop-sort-dropdown-container"
      className="relative w-full"
    >
      <button
        data-testid="desktop-sort-dropdown-toggle-button"
        onClick={onToggle}
        disabled={isLoading}
        className="w-full flex items-center justify-end gap-[9px] transition-colors duration-300 disabled:opacity-50"
      >
        <span className="text-[16px] leading-none text-center font-medium text-primary">
          {isLoading ? "Sorting..." : sortDropdownText}
        </span>
        <svg
          width="12"
          height="9"
          viewBox="0 0 12 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ease-linear ${isOpen ? "-rotate-180" : ""}`}
        >
          <path
            d="M1 3L6 8L11 3"
            stroke="#1D1D1D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            data-testid="desktop-sort-dropdown-backdrop"
            className="fixed inset-0 z-40"
            onClick={onToggle}
          />

          <div
            data-testid="desktop-sort-dropdown-menu"
            className="absolute top-full left-0 right-0 mt-[20px] bg-white border border-gray-200 rounded-md shadow-[0_0_5px_#0000001a] z-[50] overflow-hidden"
          >
            <div
              data-testid="desktop-sort-dropdown-options-container"
              className="pt-[24px] pb-[20px]"
            >
              {options.map((option) => {
                const isActiveSort = selectedSort === option.id;

                return (
                  <label
                    key={option.id}
                    data-testid={`desktop-sort-dropdown-option-${option.id}`}
                    className="flex items-center px-[20px] my-[13px] hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    <div
                      data-testid={`desktop-sort-dropdown-option-content-${option.id}`}
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
                        data-testid={`desktop-sort-dropdown-radio-${option.id}`}
                        className="size-[20px] rounded-full border border-black flex items-center justify-center transition-colors"
                      >
                        {isActiveSort && (
                          <div
                            data-testid={`desktop-sort-dropdown-radio-indicator-${option.id}`}
                            className="size-[12px] bg-black rounded-full"
                          />
                        )}
                      </div>
                      <span
                        data-testid={`desktop-sort-dropdown-option-label-${option.id}`}
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
        </>
      )}

      {errorMessage && (
        <div
          data-testid="desktop-sort-dropdown-error"
          className="absolute top-full mt-1 left-0 right-0 text-sm text-red-600 bg-white px-4 py-2 rounded-md shadow border"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};
