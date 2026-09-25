"use client";

import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
import { FilterSortBarProps, DEFAULT_SORT_OPTIONS, ICON_PATHS } from "../types";
import "../style.css";

/** Map sort-option values to stable test IDs (others get no test id). */
const SORT_OPTION_TESTIDS: Record<string, string> = {
  manual: "momsco-collection-sort-default",
  "price-ascending": "momsco-collection-sort-low-to-high",
  "price-descending": "momsco-collection-sort-high-to-low",
};

/* =====================================================================
   V1 — Filter + Sort Bar toolbar

   Source: nintarababy.in/collections/all-products
   Selector: .t4s-collection-header / .t4s-btn-filter-wrapper

   Layout:
   - Flex row, space-between, 20px top margin, 40px bottom margin
   - Filter button (left): funnel icon + "Filter" text
   - Sort button (right): "Sort By" text + chevron icon
   - Desktop: 1px solid #01464f border, 4px radius, 140px min-width, 40px min-height
   - Mobile: no borders on buttons, full-width flex

   Sort dropdown:
   - Desktop: absolute 250px dropdown, opacity fade 0.2s
   - Mobile: fixed bottom sheet, slide up 0.4s cubic-bezier
   - Option hover: bg rgba(1,70,79,0.08), color #01464f, 0.3s ease-in-out
   - Chevron rotates 180deg when open, 0.2s ease-in-out

   Filter:
   - Placeholder toggle (no real filter panel in this widget)
   ===================================================================== */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: FilterSortBarProps) {
  const sortOptions =
    (Array.isArray(data?.sortOptions) && data!.sortOptions!.length > 0
      ? data!.sortOptions!
      : null) ??
    (Array.isArray(settings?.sortOptions) && settings!.sortOptions!.length > 0
      ? settings!.sortOptions!
      : null) ??
    DEFAULT_SORT_OPTIONS;
  const [activeSortValue, setActiveSortValue] = useState(
    settings?.activeSortValue ?? sortOptions[0]?.value ?? "manual"
  );
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<
    Record<string, Set<string>>
  >({});
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, Set<string>>
  >({});
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({
    Price: true,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }

    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSortOpen]);

  // Close sort dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
        triggerRef.current?.focus();
      }
    }

    if (isSortOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isSortOpen]);

  const handleSortToggle = useCallback(() => {
    setIsSortOpen((prev) => !prev);
  }, []);

  const handleSortSelect = useCallback((value: string) => {
    setActiveSortValue(value);
    setIsSortOpen(false);
    triggerRef.current?.focus();
    window.dispatchEvent(
      new CustomEvent("nintara:sort", { detail: { sort: value } })
    );
  }, []);

  const handleFilterToggle = useCallback(() => {
    setIsFilterOpen((prev) => {
      if (!prev) {
        // Reset working state to match what's actually applied
        setSelectedFilters(
          Object.fromEntries(
            Object.entries(appliedFilters).map(([k, v]) => [k, new Set(v)])
          )
        );
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return !prev;
    });
  }, [appliedFilters]);

  const handleCloseFilter = useCallback(() => {
    setIsFilterOpen(false);
    document.body.style.overflow = "";
  }, []);

  const handleCloseSort = useCallback(() => {
    setIsSortOpen(false);
  }, []);

  /* ---- Build filters from API product data ---- */
  const pathname = usePathname();
  const currentHandle = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) ?? [];
    return segments[segments.length - 1] || "";
  }, [pathname]);

  const rawData = data as any;
  const products: any[] = useMemo(() => {
    const rd = rawData?.data;
    if (!rd) {
      return [];
    }
    // COLLECTIONS (collectionDataAll): array of { handle, products, ... }
    if (Array.isArray(rd) && rd.length > 0 && rd[0]?.handle) {
      const match = currentHandle
        ? rd.find((c: any) => c.handle === currentHandle)
        : rd[0];
      return match?.products ?? match?.data?.products ?? [];
    }
    // Single collection: { products }
    return rd?.products ?? [];
  }, [rawData, currentHandle]);

  const filterGroups = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    const priceRanges = [
      { label: "Under ₹199", min: 0, max: 19899, count: 0 },
      { label: "₹199 - ₹399", min: 19900, max: 39899, count: 0 },
      { label: "₹399 - ₹500", min: 39900, max: 49999, count: 0 },
      { label: "₹500 - ₹1,000", min: 50000, max: 99999, count: 0 },
      { label: "₹1,000 - ₹1,500", min: 100000, max: 149999, count: 0 },
      { label: "Above ₹1,500", min: 150000, max: Infinity, count: 0 },
    ];

    for (const p of products) {
      const price = p.price ?? 0;
      for (const range of priceRanges) {
        if (price >= range.min && price <= range.max) {
          range.count++;
          break;
        }
      }
    }

    const groups: {
      name: string;
      options: { label: string; count: number }[];
    }[] = [];

    const priceOpts = priceRanges
      .filter((r) => r.count > 0)
      .map((r) => ({ label: r.label, count: r.count }));
    if (priceOpts.length > 0) {
      groups.push({ name: "Price", options: priceOpts });
    }

    return groups;
  }, [products]);

  const toggleFilterGroup = useCallback((name: string) => {
    setExpandedFilters((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const toggleFilterOption = useCallback((group: string, label: string) => {
    setSelectedFilters((prev) => {
      const next = { ...prev };
      const set = new Set(next[group] ?? []);
      if (set.has(label)) {
        set.delete(label);
      } else {
        set.add(label);
      }
      next[group] = set;
      return next;
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(
      Object.fromEntries(
        Object.entries(selectedFilters).map(([k, v]) => [k, new Set(v)])
      )
    );
    const filters: Record<string, string[]> = {};
    for (const [group, labels] of Object.entries(selectedFilters)) {
      if (labels.size > 0) {
        filters[group] = Array.from(labels);
      }
    }
    window.dispatchEvent(
      new CustomEvent("nintara:filter", { detail: { filters } })
    );
    handleCloseFilter();
  }, [selectedFilters, handleCloseFilter]);

  const handleClearFilters = useCallback(() => {
    setSelectedFilters({});
    setAppliedFilters({});
    window.dispatchEvent(
      new CustomEvent("nintara:filter", { detail: { filters: {} } })
    );
    handleCloseFilter();
  }, [handleCloseFilter]);

  const activeSortLabel =
    sortOptions.find((opt) => opt.value === activeSortValue)?.label ??
    "Default";

  return (
    <div className={`nintara-fsb ${className ?? ""}`}>
      {/* Filter Button (left) */}
      <div className="nintara-fsb__filter-side">
        <button
          className="nintara-fsb__filter-btn"
          onClick={handleFilterToggle}
          aria-label="Show filters"
          aria-expanded={isFilterOpen}
          data-testid="momsco-collection-filter-btn"
        >
          <svg
            className="nintara-fsb__filter-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={ICON_PATHS.filterFunnel}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {settings?.filterButtonText ?? "Filter"}
        </button>
      </div>

      {/* Sort By Dropdown (right) */}
      <div className="nintara-fsb__sort-side">
        <div
          className="nintara-fsb__sort-dropdown"
          data-testid="momsco-collection-sort-dropdown"
        >
          <button
            ref={triggerRef}
            className={`nintara-fsb__sort-trigger${isSortOpen ? " nintara-fsb__sort-trigger--open" : ""}`}
            onClick={handleSortToggle}
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
            aria-label={`Sort by: ${activeSortLabel}`}
            data-testid="momsco-collection-sort-trigger"
          >
            <span className="nintara-fsb__sort-label">
              {settings?.sortByLabel ?? "Sort By"}
            </span>
            <svg
              className={`nintara-fsb__chevron${isSortOpen ? " nintara-fsb__chevron--rotated" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={ICON_PATHS.chevronDown}
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Dropdown panel */}
          <div
            ref={dropdownRef}
            className={`nintara-fsb__dropdown-panel${isSortOpen ? " nintara-fsb__dropdown-panel--open" : ""}`}
            role="listbox"
            aria-label="Sort options"
            tabIndex={-1}
          >
            {/* Mobile header */}
            <div className="nintara-fsb__dropdown-header">
              <span className="nintara-fsb__dropdown-title">
                Select a sort option:
              </span>
              <button
                className="nintara-fsb__dropdown-close"
                onClick={handleCloseSort}
                aria-label="Close sort options"
              >
                <svg
                  viewBox="0 0 16 14"
                  width="16"
                  aria-hidden="true"
                  fill="none"
                >
                  <path
                    d={ICON_PATHS.closeX}
                    stroke="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Sort options */}
            <div className="nintara-fsb__dropdown-content">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`nintara-fsb__sort-option${option.value === activeSortValue ? " nintara-fsb__sort-option--selected" : ""}`}
                  onClick={() => handleSortSelect(option.value)}
                  role="option"
                  aria-selected={option.value === activeSortValue}
                  data-testid={SORT_OPTION_TESTIDS[option.value]}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile bottom sheet (sort) */}
      {isSortOpen && (
        <div
          className="nintara-fsb__overlay"
          onClick={handleCloseSort}
          aria-hidden="true"
        />
      )}

      {/* Filter sidebar overlay */}
      <div
        className={`nintara-fsb__filter-overlay${isFilterOpen ? " nintara-fsb__filter-overlay--open" : ""}`}
        onClick={handleCloseFilter}
        aria-hidden="true"
      />

      {/* Filter sidebar panel */}
      <aside
        className={`nintara-fsb__filter-panel${isFilterOpen ? " nintara-fsb__filter-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        aria-hidden={!isFilterOpen}
        data-testid="momsco-collection-filter-panel"
      >
        <div className="nintara-fsb__filter-panel-header">
          <span className="nintara-fsb__filter-panel-title">
            {settings?.filterButtonText ?? "Filter"}
          </span>
          <button
            className="nintara-fsb__filter-panel-close"
            onClick={handleCloseFilter}
            aria-label="Close filters"
            data-testid="momsco-collection-filter-panel-close"
          >
            <svg viewBox="0 0 16 14" width="16" fill="none" aria-hidden="true">
              <path
                d={ICON_PATHS.closeX}
                stroke="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="nintara-fsb__filter-panel-body">
          {filterGroups.map((group) => (
            <div key={group.name} className="nintara-fsb__filter-group">
              <button
                className="nintara-fsb__filter-group-header"
                onClick={() => toggleFilterGroup(group.name)}
                aria-expanded={!!expandedFilters[group.name]}
              >
                <span>{group.name}</span>
                <svg
                  className={`nintara-fsb__filter-chevron${expandedFilters[group.name] ? " nintara-fsb__filter-chevron--open" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d={ICON_PATHS.chevronDown}
                    fill="currentColor"
                  />
                </svg>
              </button>
              {expandedFilters[group.name] && (
                <div className="nintara-fsb__filter-group-options">
                  {group.options.map((opt) => (
                    <label
                      key={opt.label}
                      className="nintara-fsb__filter-option"
                    >
                      <input
                        type="checkbox"
                        className="nintara-fsb__filter-checkbox"
                        checked={
                          selectedFilters[group.name]?.has(opt.label) ?? false
                        }
                        onChange={() =>
                          toggleFilterOption(group.name, opt.label)
                        }
                      />
                      <span className="nintara-fsb__filter-option-label">
                        {opt.label}
                      </span>
                      <span className="nintara-fsb__filter-option-count">
                        ({opt.count})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="nintara-fsb__filter-panel-footer">
          <button
            className="nintara-fsb__filter-clear"
            onClick={handleClearFilters}
          >
            {settings?.clearAllText ?? "Clear All"}
          </button>
          <button
            className="nintara-fsb__filter-apply"
            onClick={handleApplyFilters}
          >
            {settings?.applyFiltersText ?? "Apply Filters"}
          </button>
        </div>
      </aside>
    </div>
  );
});

export { V1 as default };
