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
        className="ml-auto flex items-center gap-2.5 rounded-full ring-1 ring-black/10 bg-white px-5 py-2.5 transition-colors duration-300 hover:bg-neutral-50 disabled:opacity-50"
      >
        <span className="text-sm leading-none text-center font-medium text-[#1D1D1D]">
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
            className="absolute top-full left-0 right-0 mt-2 bg-white ring-1 ring-black/[0.06] rounded-2xl shadow-lg z-[50] overflow-hidden"
          >
            <div
              data-testid="desktop-sort-dropdown-options-container"
              className="py-3"
            >
              {options.map((option) => {
                const isActiveSort = selectedSort === option.id;

                return (
                  <label
                    key={option.id}
                    data-testid={`desktop-sort-dropdown-option-${option.id}`}
                    className={`flex items-center px-5 py-2.5 cursor-pointer transition-colors duration-150 ${
                      isActiveSort ? "bg-neutral-100" : "hover:bg-neutral-50"
                    }`}
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
                        className="size-5 rounded-full border border-[#1D1D1D] flex items-center justify-center transition-colors"
                      >
                        {isActiveSort && (
                          <div
                            data-testid={`desktop-sort-dropdown-radio-indicator-${option.id}`}
                            className="size-3 bg-[#1D1D1D] rounded-full"
                          />
                        )}
                      </div>
                      <span
                        data-testid={`desktop-sort-dropdown-option-label-${option.id}`}
                        className={`ml-3 text-sm leading-[30px] font-medium ${isActiveSort ? "text-[#1D1D1D]" : "text-neutral-600"}`}
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
