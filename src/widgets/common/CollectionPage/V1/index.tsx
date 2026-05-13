"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CartAwareProductCard } from "@/ui/components/CartAwareProductCard";
import { sortOptions } from "../compounds/sortOptions";
import { transformProductForCard } from "../adapters/productAdapter";
import { collectionApiClient } from "../api/client";
import { TransformedCollection } from "../api/types";
import { BaseProvider, DefaultContext } from "../base/provider";
import { IApplyFilter } from "../base/provider/type";
import { DesktopSortDropdown } from "../compounds/DesktopSortDropDown";
import { FilterSectionDesktop } from "../compounds/FilterSectionDesktop";
import { MobileFilterDropdown } from "../compounds/MobileFilterDropdown";
import { MobileSortDropdown } from "../compounds/MobileSortDropdown";
import { ApiFilter } from "../constants";
import { IProps, ISettings, TProps } from "../types";

import { LoadMore } from "../compounds/LoadMore";
import "../style.css";

const V1Content = ({ data, settings, actions, feedback, state }: IProps) => {
  const safeSettings: ISettings = settings ?? { variant: "v1" };
  const {
    autoLoadMore = false,
    filterTitle = "Filters",
    sortDropdownText = "Sort by",
    showFilterAndSort = true,
    showActionButton = true,
    actionButtonText = "Add to cart",
    soldOutText = "View",
    showBadge = true,
    showRating = true,
    actionButtonTextColor,
    sectionTextColor,
    productCardBackgroundColor,
  } = safeSettings;

  // UI state
  const [isMobileSortDropdownOpen, setMobileSortDropdownOpen] = useState(false);
  const [isDesktopSortDropdownOpen, setDesktopSortDropdownOpen] =
    useState(false);
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [mobileLocalFilters, setMobileLocalFilters] = useState<
    Record<string, string[]>
  >({});
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [preservedScrollLeft, setPreservedScrollLeft] = useState<number | null>(
    null
  );

  const collectionRef = useRef<TransformedCollection | null>(null);
  const shouldScrollRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const filterChipsContainerRef = useRef<HTMLDivElement>(null);

  const collection = state.collection as TransformedCollection | null;

  const products = collection?.products || [];
  const hasNextPage = collection?.hasNextPage || false;

  useEffect(() => {
    collectionRef.current = collection;
  }, [collection]);

  useEffect(() => {
    if (!isMobileFilterOpen) {
      setPreviewCount(null);
    }
  }, [isMobileFilterOpen]);

  /**
   * Lightweight collection fetch (first:1) with the current draft filters
   * to update the "Show Results" preview count. Does NOT touch state.collection.
   */
  const fetchPreviewCount = useCallback(
    async (draftFilters: Record<string, string[]>) => {
      const col = collectionRef.current;
      if (!col?.handle) {
        return;
      }

      const apiFilters = Object.entries(draftFilters)
        .filter(([, values]) => values.length > 0)
        .map(([filterId, values]) => ({ filterId, values }));

      try {
        const response = await collectionApiClient.fetchCollection(col.handle, {
          first: 1,
          filters: apiFilters,
        });
        setPreviewCount(response.productCount);
      } catch {
        // Silently ignore preview errors — button keeps the last count
      }
    },
    []
  );

  const filterApiData = (state as any).filterData || (data as any)?.filters;
  const filters: ApiFilter[] =
    filterApiData && Array.isArray(filterApiData) ? filterApiData : [];

  const getCurrentSortLabel = () => {
    if (state.sort?.value && state.sort?.order) {
      const matchingOption = sortOptions.find(
        (option) =>
          option.value === state.sort?.value &&
          option.order === state.sort?.order
      );
      return matchingOption?.label || sortOptions[0].label;
    }
    return sortOptions[0].label;
  };

  const handleSortChange = async (sortValue: string) => {
    setMobileSortDropdownOpen(false);
    setDesktopSortDropdownOpen(false);
    const selectedOption = sortOptions.find(
      (option) => option.id === sortValue
    );
    if (selectedOption) {
      shouldScrollRef.current = true;
      await actions("SORT", selectedOption);
    }
  };

  const handleToggleMobileSortDropdown = () => {
    setMobileSortDropdownOpen(!isMobileSortDropdownOpen);
  };

  const handleToggleDesktopSortDropdown = () => {
    setDesktopSortDropdownOpen(!isDesktopSortDropdownOpen);
  };

  const handleToggleMobileFilter = () => {
    setMobileFilterOpen(!isMobileFilterOpen);
  };

  const createFilterChangePayload = (
    filterId: string,
    optionValue: string,
    actionType: "ADD" | "REMOVE"
  ): IApplyFilter | null => {
    const filter = filters.find((f) => f.id === filterId);
    if (!filter) {
      return null;
    }

    const filterValue = filter.values.find((v) => v.value === optionValue);
    if (!filterValue) {
      return null;
    }

    const hasGroupedOptions =
      filterValue.options &&
      Array.isArray(filterValue.options) &&
      filterValue.options.length > 0;

    if (hasGroupedOptions) {
      const groupedFilterValues = filterValue.options!.map((option) => ({
        id: `${filterId}_${optionValue}_${option}`,
        label: option,
        input: option,
        count: filterValue.count,
      }));

      return {
        filter: {
          id: filterId,
          label: filter.filter_label,
          type: "LIST",
          values: groupedFilterValues,
        },
        type: actionType,
      };
    }

    return {
      filter: {
        id: filterId,
        label: filter.filter_label,
        type: "LIST",
        values: [
          {
            id: `${filterId}_${optionValue}`,
            label: optionValue,
            input: optionValue,
            count: filterValue.count,
          },
        ],
      },
      type: actionType,
    };
  };

  const handleFilterChangeFromUI = async (
    filterId: string,
    optionValue: string,
    checked: boolean
  ) => {
    const payload = createFilterChangePayload(
      filterId,
      optionValue,
      checked ? "ADD" : "REMOVE"
    );
    if (payload) {
      shouldScrollRef.current = true;
      await actions("FILTER", payload);
    }
  };

  const clearAllFilters = async () => {
    shouldScrollRef.current = true;
    setMobileLocalFilters({});
    await actions("CLEAR_ALL_FILTERS");
  };

  /**
   * Called only when the user clicks "Show Results" in the mobile filter
   * sheet. Diffs current vs staged filters, fires ADD/REMOVE for each
   * change, then syncs `mobileLocalFilters`. Closing via backdrop / × does
   * NOT call this — product list is never touched unless explicitly applied.
   */
  const handleApplyMobileFilters = async (
    newFilters: Record<string, string[]>
  ) => {
    const currentFilters = mobileLocalFilters;

    const hasNewFilters = Object.values(newFilters).some(
      (arr) => arr.length > 0
    );

    if (!hasNewFilters) {
      await clearAllFilters();
      return;
    }

    const allFilterIds = Array.from(
      new Set([...Object.keys(currentFilters), ...Object.keys(newFilters)])
    );

    for (const filterId of allFilterIds) {
      const currentValues = currentFilters[filterId] || [];
      const newValues = newFilters[filterId] || [];

      for (const value of currentValues) {
        if (!newValues.includes(value)) {
          await handleFilterChangeFromUI(filterId, value, false);
        }
      }

      for (const value of newValues) {
        if (!currentValues.includes(value)) {
          await handleFilterChangeFromUI(filterId, value, true);
        }
      }
    }

    setMobileLocalFilters(newFilters);
  };

  const loadMore = useCallback(async () => {
    if (!actions) {
      return;
    }
    try {
      await actions("LOAD_MORE");
    } catch (error) {
      console.error("LoadMore action failed:", error);
    }
  }, [actions]);

  const totalProducts = collection?.productCount || 0;

  const getProductTypeFilters = () => {
    const productTypeFilters: Array<{
      filterId: string;
      filterLabel: string;
      value: string;
      label: string;
      isActive: boolean;
    }> = [];

    filters.forEach((filter) => {
      if ((filter as any).source_type === "product_type") {
        filter.values.forEach((value) => {
          const isActive =
            mobileLocalFilters[filter.id]?.includes(value.value) || false;

          productTypeFilters.push({
            filterId: filter.id,
            filterLabel: filter.filter_label,
            value: value.value,
            label: value.value,
            isActive,
          });
        });
      }
    });

    return productTypeFilters.sort((a, b) => {
      if (a.isActive && !b.isActive) {
        return -1;
      }
      if (!a.isActive && b.isActive) {
        return 1;
      }
      return a.label.localeCompare(b.label);
    });
  };

  const productTypeFilters = getProductTypeFilters();

  const scrollFilterBarToTop = () => {
    if (!isFixed && sentinelRef.current) {
      sentinelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (preservedScrollLeft !== null && filterChipsContainerRef.current) {
      filterChipsContainerRef.current.scrollTo({
        left: 0,
        behavior: "instant",
      });
      setPreservedScrollLeft(null);
    }
  }, [productTypeFilters, preservedScrollLeft]);

  const handleRemoveProductTypeFilter = async (
    filterId: string,
    value: string
  ) => {
    if (filterChipsContainerRef.current) {
      setPreservedScrollLeft(filterChipsContainerRef.current.scrollLeft);
    }
    setMobileLocalFilters((prev) => {
      const currentOptions = prev[filterId] || [];
      const newOptions = currentOptions.filter((option) => option !== value);
      return { ...prev, [filterId]: newOptions };
    });

    await handleFilterChangeFromUI(filterId, value, false);
  };

  const handleAddProductTypeFilter = async (
    filterId: string,
    value: string
  ) => {
    scrollFilterBarToTop();
    if (filterChipsContainerRef.current) {
      setPreservedScrollLeft(filterChipsContainerRef.current.scrollLeft);
    }
    setMobileLocalFilters((prev) => {
      const currentOptions = prev[filterId] || [];
      const newOptions = [...currentOptions, value];
      return { ...prev, [filterId]: newOptions };
    });

    await handleFilterChangeFromUI(filterId, value, true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting);
      },
      {
        rootMargin: "-58px 0px 0px 0px",
        threshold: 0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const gridRef = useCallback((node: HTMLDivElement | null) => {
    if (!shouldScrollRef.current) {
      return;
    }
    if (node) {
      const offset = window.innerWidth >= 768 ? 125 : 115;
      const top = node.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      shouldScrollRef.current = false;
    }
  }, []);

  const isLoading =
    feedback.isLoading("FILTER") ||
    feedback.isLoading("SORT") ||
    feedback.isLoading("CLEAR_ALL_FILTERS");

  return (
    <div
      data-testid="collection-page-container"
      className="mx-auto lg:max-w-[1400px] xl3:max-w-[1300px]"
    >
      <div
        data-testid="collection-page-content"
        className="px-[15px] md:px-[30px] xl:px-20 pb-[5.25rem] md:pb-24 lg:pb-[130px] xl3:px-0"
      >
        {collection?.title && (
          <h1
            data-testid="collection-page-title"
            className="text-left xl2:text-center leading-none text-[22px] md:text-[32px] font-bold md:border-b md:border-[#D9D9D9] pb-3.5 md:pb-[26px] lg:pb-8 pt-10 md:pt-[46px] lg:pt-14"
            style={sectionTextColor ? { color: sectionTextColor } : undefined}
          >
            {collection.title}
          </h1>
        )}

        <div
          data-testid="collection-page-sentinel"
          ref={sentinelRef}
          className="h-px"
        />

        {showFilterAndSort && (
          <div
            className={`md:hidden ${isFixed ? "w-full h-8 mb-[25px]" : ""}`}
          />
        )}
        {showFilterAndSort && (
          <div
            data-testid="collection-page-mobile-filters-container"
            ref={filterChipsContainerRef}
            className={`flex items-center gap-2 overflow-auto hide-scrollbar md:hidden transition-all duration-200 ${
              isFixed
                ? "fixed top-[58px] left-0 right-0 z-[1200] bg-white shadow-md mb-0 py-2.5"
                : "relative mb-[16px]"
            }`}
          >
            <MobileFilterDropdown
              filterTitle={filterTitle}
              isOpen={isMobileFilterOpen}
              onToggle={handleToggleMobileFilter}
              filters={filters}
              onApplyFilters={handleApplyMobileFilters}
              onLocalFiltersChange={setMobileLocalFilters}
              mobileLocalFilters={mobileLocalFilters}
              isLoading={feedback.isLoading("FILTER")}
              errorMessage={
                feedback.isError("FILTER")
                  ? feedback.getMessage("FILTER").message
                  : undefined
              }
              onDraftFiltersChange={fetchPreviewCount}
              resultCount={previewCount !== null ? previewCount : totalProducts}
            />

            <div
              className="w-auto"
              data-testid="bblunt-collection-page-mobile-sort"
            >
              <MobileSortDropdown
                sortDropdownText={sortDropdownText}
                isOpen={isMobileSortDropdownOpen}
                onToggle={handleToggleMobileSortDropdown}
                options={sortOptions}
                selectedSort={state.sort?.id || "featured"}
                onSortChange={handleSortChange}
                isLoading={feedback.isLoading("SORT")}
                errorMessage={
                  feedback.isError("SORT")
                    ? feedback.getMessage("SORT").message
                    : undefined
                }
                currentSortLabel={getCurrentSortLabel()}
              />
            </div>

            {productTypeFilters.length > 0 && (
              <>
                {productTypeFilters.map((filter) => (
                  <button
                    key={`${filter.filterId}_${filter.value}`}
                    data-testid={`collection-page-product-type-filter-${filter.filterId}-${filter.value}`}
                    onClick={() => {
                      if (filter.isActive) {
                        handleRemoveProductTypeFilter(
                          filter.filterId,
                          filter.value
                        );
                      } else {
                        handleAddProductTypeFilter(
                          filter.filterId,
                          filter.value
                        );
                      }
                    }}
                    className={`
                    flex items-center justify-between gap-2.5 p-2 rounded transition-colors duration-200 border
                    ${
                      filter.isActive
                        ? "border-[#AFB7FF] bg-[#EBEDFF]"
                        : "bg-white border-[#D9D9D980]"
                    }
                  `}
                  >
                    <span
                      className={`whitespace-nowrap text-xs text-primary leading-none text-center ${filter.isActive ? "font-bold" : "font-medium"}`}
                    >
                      {filter.label}
                    </span>
                    {filter.isActive && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.9522 2.04792C9.2217 -0.682504 4.77867 -0.682773 2.04795 2.04792C-0.682783 4.7786 -0.682514 9.22129 2.04795 11.952C4.7784 14.6827 9.22143 14.6827 11.9522 11.952C14.6826 9.22129 14.6826 4.77834 11.9522 2.04792ZM9.76175 9.76161C9.55139 9.97198 9.21038 9.97198 9.00002 9.76161L7.00005 7.76168L4.905 9.85669C4.69463 10.0671 4.35363 10.0671 4.14326 9.85669C3.9329 9.64633 3.9329 9.30533 4.14326 9.09497L6.23831 6.99995L4.23835 5.00001C4.02798 4.78965 4.02798 4.44838 4.23835 4.23828C4.44871 4.02792 4.78972 4.02792 5.00008 4.23828L7.00005 6.23822L8.90466 4.33363C9.11503 4.12327 9.45603 4.12327 9.6664 4.33363C9.87677 4.544 9.87677 4.885 9.6664 5.09536L7.76179 6.99995L9.76175 8.99989C9.97212 9.21025 9.97212 9.55125 9.76175 9.76161Z"
                          fill="#9399D0"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        <div
          data-testid="collection-page-main-layout"
          className="flex gap-4 md:pt-[26px] xl2:pt-7"
        >
          {showFilterAndSort && (
            <aside
              data-testid="collection-page-desktop-sidebar"
              className="md:flex-shrink-0 md:w-[calc(21%-(16px/2))] md:pr-3 hidden xl2:block max-w-[252px]"
            >
              <FilterSectionDesktop
                filterTitle={filterTitle}
                filters={filters}
                onFilterChange={handleFilterChangeFromUI}
              />
            </aside>
          )}

          {isLoading ? (
            <div
              data-testid="collection-page-loading-container"
              className={`flex items-center justify-center min-h-[400px] ${showFilterAndSort ? "flex-1" : "w-full mx-auto"}`}
            >
              <div
                data-testid="collection-page-loading-spinner"
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
              />
            </div>
          ) : (
            <div
              data-testid="collection-page-products-section"
              className={showFilterAndSort ? "flex-1" : "w-full mx-auto"}
            >
              <div
                data-testid="collection-page-products-header"
                className="flex justify-between items-center pb-[25px] lg:pb-9 mt-[4px]"
              >
                <p
                  data-testid="collection-page-products-count"
                  className="text-primary text-xs md:text-base leading-none"
                >
                  {totalProducts > 0 ? totalProducts : "No"} products found for
                  you
                </p>
                {showFilterAndSort && (
                  <div
                    className="min-w-[250px] hidden md:block"
                    data-testid="bblunt-collection-page-desktop-sort"
                  >
                    <DesktopSortDropdown
                      sortDropdownText={sortDropdownText}
                      isOpen={isDesktopSortDropdownOpen}
                      onToggle={handleToggleDesktopSortDropdown}
                      options={sortOptions}
                      selectedSort={state.sort?.id || ""}
                      onSortChange={handleSortChange}
                      isLoading={feedback.isLoading("SORT")}
                      errorMessage={
                        feedback.isError("SORT")
                          ? feedback.getMessage("SORT").message
                          : undefined
                      }
                      currentSortLabel={getCurrentSortLabel()}
                    />
                  </div>
                )}
              </div>

              <div
                ref={gridRef}
                data-testid="collection-page-products-grid"
                className="product-grid-container grid grid-cols-2 md:grid-cols-3 xl2:grid-cols-4 gap-4"
              >
                {products.map((product, index) => {
                  const cardProduct = transformProductForCard(product);
                  return (
                    <div
                      key={product.id || index}
                      data-testid={`collection-page-product-card-${product.id || index}`}
                      className="product-card-wrapper h-full"
                      style={{ "--index": index } as React.CSSProperties}
                    >
                      <CartAwareProductCard
                        cardProduct={cardProduct}
                        settings={{
                          showAddToCartToast: true,
                          showActionButton,
                          actionButtonText,
                          soldOutText,
                          showBadge,
                          showRating,
                          actionButtonTextColor,
                          backgroundColor: productCardBackgroundColor,
                          color: sectionTextColor,
                        }}
                        className="md:border md:!rounded-lg !border-white md:!border-[#EBEBEB] !pl-0"
                        logTag="CollectionPage"
                      />
                    </div>
                  );
                })}
              </div>

              <LoadMore
                onLoadMore={loadMore}
                hasNextPage={hasNextPage}
                isLoading={feedback.isLoading("LOAD_MORE")}
                autoLoadMore={autoLoadMore}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const V1 = ({ data, settings, className, locale }: TProps) => {
  return (
    <BaseProvider data={data}>
      <DefaultContext.Consumer>
        {(context) => (
          <V1Content
            data={data}
            settings={settings}
            className={className}
            locale={locale}
            actions={context.actions}
            feedback={context.feedback}
            state={context.state}
          />
        )}
      </DefaultContext.Consumer>
    </BaseProvider>
  );
};
