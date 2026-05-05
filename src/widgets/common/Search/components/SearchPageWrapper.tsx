"use client";

import { Box, Flex, Text } from "@/ui/atomic";
import SearchLoadingSpinner from "./SearchLoadingSpinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ProductResponse } from "../types";
import {
  AVAILABILITY_OPTION_ID,
  FILTER_ID,
  FILTER_URL_PARAM,
  getSortIdFromParams,
  SORT_API_PARAMS,
} from "../constants/search-constants";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { getSearchResultsForComponent } from "../services/search-api";
import {
  createProductCartHandlers,
  mapSearchProductToProductResponse,
} from "../utils/ProductMapper";
import DesktopSortDropdown from "./DesktopSortDropdown";
import FilterSideBar from "./FilterSideBar";
import MobileFilterBar from "./MobileFilterBar";
import NoResultPage from "./NoResultPage";
import SearchProductCard from "./SearchProductCard";
import SelectedFilters from "./SelectedFilters";
import ShimmerFilterSideBar from "./ShimmerFilterSideBar";
import { ShimmerProductCard } from "./ShimmerProductCard";

interface SearchPageWrapperProps {
  settings?: {
    variant?: string;
    noResultsMessage?: string;
    suggestionMessage?: string;
    bestsellingProductsTitle?: string;
    filterByText?: string;
    clearAllText?: string;
    filterText?: string;
    closeText?: string;
    applyText?: string;
    noOptionsAvailableText?: string;
    showingText?: string;
    resultsText?: string;
    forText?: string;
    actionButtonText?: string;
    actionButtonTextMobile?: string;
    soldOutText?: string;
    soldOutTextMobile?: string;
  };
}

/** Responsive horizontal margin: 0 at <1400px, then 20–250px by viewport (1400–1900px) */
const SEARCH_PAGE_CONTAINER_MARGIN_CLASS =
  "mx-0 min-[1400px]:mx-5 min-[1455px]:mx-[27px] min-[1500px]:mx-[50px] min-[1600px]:mx-[100px] min-[1700px]:mx-[150px] min-[1800px]:mx-[200px] min-[1900px]:mx-[250px]";

const SearchPageWrapper: React.FC<SearchPageWrapperProps> = ({ settings }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Cart wiring temporarily disabled — no-ops with the same shape as the
  // previous `useAddToCart` / `useCartQuantity` hooks. To re-enable, restore
  // `import { useAddToCart, useCartQuantity } from "@/lib/hooks";` and the
  // original destructure.
  const addToCart = async (_product?: unknown, _variantId?: string) => {
    /* no-op */
  };
  const incrementQuantity = async (_product?: unknown) => {
    /* no-op */
  };
  const decrementQuantity = async (_product?: unknown) => {
    /* no-op */
  };
  const isInCart = (_product?: unknown) => false;
  const getCartItem = (_product?: unknown) => undefined;
  const isProductLoading = (_product?: unknown) => false;

  const searchQuery = searchParams.get("q") || "";
  const collectionsFromUrl = searchParams.getAll("collection");
  const productTypesFromUrl = searchParams.getAll("productType");
  const pageFromUrl = searchParams.get("page");
  const currentPage = pageFromUrl
    ? Math.max(parseInt(pageFromUrl, 10) || 1, 1)
    : 1;

  const collectionParamKey = useMemo(
    () => searchParams.getAll("collection").slice().sort().join(","),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );
  const productTypeParamKey = useMemo(
    () => searchParams.getAll("productType").slice().sort().join(","),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );

  const sortByFromUrl = searchParams.get("sortBy") || null;
  const sortOrderFromUrl = searchParams.get("sortOrder") || null;
  const selectedSort = useMemo(
    () => getSortIdFromParams(sortByFromUrl, sortOrderFromUrl),
    [sortByFromUrl, sortOrderFromUrl]
  );
  const sortParamKey = useMemo(
    () => (sortByFromUrl ? `${sortByFromUrl}_${sortOrderFromUrl}` : ""),
    [sortByFromUrl, sortOrderFromUrl]
  );
  const includeOutOfStockFromUrl = searchParams.get("inStock") === "false";
  const inStockForApi = !includeOutOfStockFromUrl;
  const onSaleForApi = !includeOutOfStockFromUrl;
  const minPriceFromUrl = searchParams.get("minPrice");
  const maxPriceFromUrl = searchParams.get("maxPrice");
  const priceParamKey = useMemo(
    () =>
      minPriceFromUrl != null && minPriceFromUrl !== ""
        ? maxPriceFromUrl != null && maxPriceFromUrl !== ""
          ? `${minPriceFromUrl},${maxPriceFromUrl}`
          : `${minPriceFromUrl},null`
        : "",
    [minPriceFromUrl, maxPriceFromUrl]
  );
  const minDiscountFromUrl = searchParams.get("minDiscount");
  const maxDiscountFromUrl = searchParams.get("maxDiscount");
  const discountParamKey = useMemo(
    () =>
      minDiscountFromUrl != null && minDiscountFromUrl !== ""
        ? maxDiscountFromUrl != null && maxDiscountFromUrl !== ""
          ? `[${minDiscountFromUrl},${maxDiscountFromUrl}]`
          : `[${minDiscountFromUrl},null]`
        : "",
    [minDiscountFromUrl, maxDiscountFromUrl]
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Pagination state for infinite scroll
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const lastFilterUrlUpdateByUsRef = useRef(0);

  // Helper to update URL query params
  const updateUrlSearchParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      updater(params);
      const queryString = params.toString();
      const currentQueryString = searchParams.toString();
      if (queryString === currentQueryString) {
        return;
      }
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(url);
    },
    [pathname, router, searchParams]
  );

  const searchKey = useMemo(
    () =>
      JSON.stringify({
        q: searchQuery,
        collections: collectionParamKey,
        productTypes: productTypeParamKey,
        sort: sortParamKey,
        includeOutOfStock: includeOutOfStockFromUrl,
        price: priceParamKey,
        discount: discountParamKey,
      }),
    [
      searchQuery,
      collectionParamKey,
      productTypeParamKey,
      sortParamKey,
      includeOutOfStockFromUrl,
      priceParamKey,
      discountParamKey,
    ]
  );

  useEffect(() => {
    setPage(1);
    setTotalPages(1);
  }, [searchKey]);

  const handleAddToCart = async (product: ProductResponse) => {
    const payload = {
      ...product,
      quantity: 1,
      variants: product?.variant ? [product.variant] : undefined,
    } as ProductResponse & { variants?: Array<{ id: string; price?: number }> };
    const variantIdArg = product?.variant?.id;
    try {
      await addToCart(payload, variantIdArg);
    } catch (error) {
      console.error("[Search] addToCart failed:", error);
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setIsSearchLoading(false);
        setIsInitialLoad(false);
        return;
      }

      setIsSearchLoading(true);
      // Full-page shimmer only when we have no data yet; filter/page refetch = background update
      setIsInitialLoad((prev) => (searchResults === null ? true : prev));
      setSearchError(null);

      try {
        const sortParams = SORT_API_PARAMS[selectedSort] ?? {};
        const results = await getSearchResultsForComponent(searchQuery, {
          page,
          limit: 30,
          collection: collectionsFromUrl.length
            ? collectionsFromUrl
            : undefined,
          productType: productTypesFromUrl.length
            ? productTypesFromUrl
            : undefined,
          sortBy: sortParams.sortBy,
          sortOrder: sortParams.sortOrder,
          inStock: inStockForApi,
          onSale: onSaleForApi,
          minPrice:
            minPriceFromUrl != null && minPriceFromUrl !== ""
              ? Number(minPriceFromUrl)
              : undefined,
          maxPrice:
            maxPriceFromUrl != null && maxPriceFromUrl !== ""
              ? Number(maxPriceFromUrl)
              : undefined,
          minDiscount:
            minDiscountFromUrl != null && minDiscountFromUrl !== ""
              ? Number(minDiscountFromUrl)
              : undefined,
          maxDiscount:
            maxDiscountFromUrl != null && maxDiscountFromUrl !== ""
              ? Number(maxDiscountFromUrl)
              : undefined,
        });
        setSearchResults((prev: any) => {
          if (!prev || page === 1) {
            return results;
          }
          const nextProducts = Array.isArray(prev.products)
            ? [...prev.products, ...results.products]
            : results.products;

          // Keep previous facets when pagination response has empty facets (API often omits facets on page > 1)
          const textFacetResponse = results.textFacets as
            | Record<string, unknown>
            | undefined;
          const hasTextFacets =
            textFacetResponse &&
            ((Array.isArray(textFacetResponse.st_newcollections) &&
              textFacetResponse.st_newcollections.length > 0) ||
              (Array.isArray(textFacetResponse.product_type) &&
                textFacetResponse.product_type.length > 0));
          const numericFacetResponse = results.numericFacets as
            | Record<string, unknown>
            | undefined;
          const hasNumericFacets =
            numericFacetResponse &&
            ((Array.isArray(numericFacetResponse.discounted_price) &&
              numericFacetResponse.discounted_price.length > 0) ||
              (Array.isArray(numericFacetResponse.discount) &&
                numericFacetResponse.discount.length > 0));

          return {
            ...prev,
            products: nextProducts,
            pagination: results.pagination ?? prev.pagination,
            totalHits: results.totalHits ?? prev.totalHits,
            textFacets: hasTextFacets ? results.textFacets : prev.textFacets,
            numericFacets: hasNumericFacets
              ? results.numericFacets
              : prev.numericFacets,
          };
        });

        if (results?.pagination?.totalPages) {
          setTotalPages(results.pagination.totalPages);
        } else {
          setTotalPages(page);
        }
      } catch (error) {
        setSearchError("Failed to fetch search results");
        setSearchResults({
          products: [],
          totalHits: 0,
          query: searchQuery,
          textFacets: { productType: [], collections: [] },
          numericFacets: { price: [], discount: [] },
          pagination: {
            currentPage: 1,
            limit: 20,
            totalPages: 1,
            totalResults: 0,
          },
        });
      } finally {
        setIsSearchLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    page,
    collectionParamKey,
    productTypeParamKey,
    sortParamKey,
    includeOutOfStockFromUrl,
    priceParamKey,
    discountParamKey,
  ]);

  const textFacets = searchResults
    ? searchResults.textFacets
    : {
        st_newcollections: [],
        product_type: [],
      };

  const numericFacets = searchResults
    ? searchResults.numericFacets
    : {
        discounted_price: [],
        discount: [],
      };

  const collectionDetails = searchResults?.collectionDetails ?? [];

  // URL sync for both collection and product-type filters (same architecture)
  const handleFilterUrlSync = useCallback(
    (filterId: string, apiValue: string, checked: boolean) => {
      if (filterId === FILTER_ID.AVAILABILITY) {
        updateUrlSearchParams((params) => {
          params.delete(FILTER_URL_PARAM.PAGE);
          if (checked) {
            // User selected "Include Out of Stock" → send inStock=false, onSale=false
            params.set(FILTER_URL_PARAM.IN_STOCK, "false");
            params.set(FILTER_URL_PARAM.ON_SALE, "false");
          } else {
            // Revert to default: exclude out of stock
            params.set(FILTER_URL_PARAM.IN_STOCK, "true");
            params.set(FILTER_URL_PARAM.ON_SALE, "true");
          }
        });
        lastFilterUrlUpdateByUsRef.current = Date.now();
        return;
      }

      if (filterId === FILTER_ID.PRICE) {
        updateUrlSearchParams((params) => {
          params.delete(FILTER_URL_PARAM.PAGE);
          params.delete(FILTER_URL_PARAM.MIN_PRICE);
          params.delete(FILTER_URL_PARAM.MAX_PRICE);
          if (checked) {
            const [min, max] = apiValue.split(",").map((v) => v.trim());
            if (min != null && min !== "") {
              params.set(FILTER_URL_PARAM.MIN_PRICE, min);
              if (max != null && max !== "" && max !== "null") {
                params.set(FILTER_URL_PARAM.MAX_PRICE, max);
              }
            }
          }
        });
        lastFilterUrlUpdateByUsRef.current = Date.now();
        return;
      }

      if (filterId === FILTER_ID.DISCOUNT) {
        updateUrlSearchParams((params) => {
          params.delete(FILTER_URL_PARAM.PAGE);
          params.delete(FILTER_URL_PARAM.MIN_DISCOUNT);
          params.delete(FILTER_URL_PARAM.MAX_DISCOUNT);
          if (checked) {
            const raw = apiValue.replace(/^\[|\]$/g, "").trim();
            const [minStr, maxStr] = raw.split(",").map((v) => v.trim());
            const min = minStr != null && minStr !== "" ? minStr : null;
            const max =
              maxStr != null && maxStr !== "" && maxStr !== "null"
                ? maxStr
                : null;
            if (min != null) {
              if (max != null) {
                params.set(FILTER_URL_PARAM.MIN_DISCOUNT, min);
                params.set(FILTER_URL_PARAM.MAX_DISCOUNT, max);
              } else {
                params.set(FILTER_URL_PARAM.MIN_DISCOUNT, min);
              }
            }
          }
        });
        lastFilterUrlUpdateByUsRef.current = Date.now();
        return;
      }

      const paramName =
        filterId === FILTER_ID.COLLECTIONS
          ? FILTER_URL_PARAM.COLLECTION
          : filterId === FILTER_ID.PRODUCT_TYPE
            ? FILTER_URL_PARAM.PRODUCT_TYPE
            : null;
      if (!paramName) {
        return;
      }

      updateUrlSearchParams((params) => {
        params.delete(FILTER_URL_PARAM.PAGE);
        const existing = params.getAll(paramName);
        params.delete(paramName);
        let nextValues = existing;
        if (checked) {
          if (!existing.includes(apiValue)) {
            nextValues = [...existing, apiValue];
          }
        } else {
          nextValues = existing.filter((value) => value !== apiValue);
        }

        nextValues.forEach((value) => {
          params.append(paramName, value);
        });
      });
      lastFilterUrlUpdateByUsRef.current = Date.now();
    },
    [updateUrlSearchParams]
  );

  const {
    dynamicFilters,
    selectedFilters,
    handleFilterChange: hookHandleFilterChange,
    clearAllFilters,
  } = useSearchFilter({
    textFacets,
    numericFacets,
    collectionDetails,
    onFilterChange: (filterId: string, apiValue: string, checked: boolean) => {
      handleFilterUrlSync(filterId, apiValue, checked);
    },
    onClearAll: () => {
      lastFilterUrlUpdateByUsRef.current = Date.now();
      updateUrlSearchParams((params) => {
        params.delete(FILTER_URL_PARAM.COLLECTION);
        params.delete(FILTER_URL_PARAM.PRODUCT_TYPE);
        params.delete(FILTER_URL_PARAM.IN_STOCK);
        params.delete(FILTER_URL_PARAM.ON_SALE);
        params.delete(FILTER_URL_PARAM.MIN_PRICE);
        params.delete(FILTER_URL_PARAM.MAX_PRICE);
        params.delete(FILTER_URL_PARAM.MIN_DISCOUNT);
        params.delete(FILTER_URL_PARAM.MAX_DISCOUNT);
        params.delete(FILTER_URL_PARAM.PAGE);
      });
    },
  });

  const resetFilters = useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

  const handleSortChange = useCallback(
    (sortId: string) => {
      const params = SORT_API_PARAMS[sortId] ?? {};
      updateUrlSearchParams((p) => {
        p.delete("page");
        if (params.sortBy) {
          p.set("sortBy", params.sortBy);
          if (params.sortOrder) {
            p.set("sortOrder", params.sortOrder);
          }
        } else {
          p.delete("sortBy");
          p.delete("sortOrder");
        }
      });
    },
    [updateUrlSearchParams]
  );

  const SYNC_SKIP_MS = 400;

  useEffect(() => {
    if (Date.now() - lastFilterUrlUpdateByUsRef.current < SYNC_SKIP_MS) {
      return;
    }

    const syncFilterFromUrl = (filterId: string, paramName: string) => {
      const filter = dynamicFilters.find((f: any) => f.id === filterId);
      if (!filter) {
        return;
      }

      const urlValues = searchParams.getAll(paramName);
      const valueSet = new Set(urlValues);

      filter.values.forEach((option: any) => {
        const shouldBeSelected = valueSet.has(option.apiValue);
        const isSelected = !!selectedFilters[option.id];

        if (shouldBeSelected !== isSelected) {
          hookHandleFilterChange(
            filter.id,
            option.id,
            shouldBeSelected,
            option
          );
        }
      });
    };

    syncFilterFromUrl(FILTER_ID.COLLECTIONS, FILTER_URL_PARAM.COLLECTION);
    syncFilterFromUrl(FILTER_ID.PRODUCT_TYPE, FILTER_URL_PARAM.PRODUCT_TYPE);

    const availabilityFilter = dynamicFilters.find(
      (f: any) => f.id === FILTER_ID.AVAILABILITY
    );
    if (availabilityFilter) {
      const option = availabilityFilter.values.find(
        (o: any) =>
          o.id === AVAILABILITY_OPTION_ID.INCLUDE_OUT_OF_STOCK ||
          o.id === AVAILABILITY_OPTION_ID.EXCLUDE_OUT_OF_STOCK
      );
      if (option) {
        const isSelected = !!selectedFilters[option.id];
        const shouldBeSelected = includeOutOfStockFromUrl;
        if (shouldBeSelected !== isSelected) {
          hookHandleFilterChange(
            FILTER_ID.AVAILABILITY,
            option.id,
            shouldBeSelected,
            option
          );
        }
      }
    }

    const priceFilter = dynamicFilters.find(
      (f: any) => f.id === FILTER_ID.PRICE
    );
    if (priceFilter && minPriceFromUrl != null && minPriceFromUrl !== "") {
      const urlPriceKey =
        maxPriceFromUrl != null && maxPriceFromUrl !== ""
          ? `${minPriceFromUrl},${maxPriceFromUrl}`
          : `${minPriceFromUrl},null`;
      priceFilter.values.forEach((option: any) => {
        const shouldBeSelected = option.apiValue === urlPriceKey;
        const isSelected = !!selectedFilters[option.id];
        if (shouldBeSelected !== isSelected) {
          hookHandleFilterChange(
            FILTER_ID.PRICE,
            option.id,
            shouldBeSelected,
            option
          );
        }
      });
    } else if (
      priceFilter &&
      (minPriceFromUrl == null || minPriceFromUrl === "")
    ) {
      priceFilter.values.forEach((option: any) => {
        if (selectedFilters[option.id]) {
          hookHandleFilterChange(FILTER_ID.PRICE, option.id, false, option);
        }
      });
    }

    const discountFilter = dynamicFilters.find(
      (f: any) => f.id === FILTER_ID.DISCOUNT
    );
    if (
      discountFilter &&
      minDiscountFromUrl !== null &&
      minDiscountFromUrl !== ""
    ) {
      const urlDiscountKey =
        maxDiscountFromUrl != null && maxDiscountFromUrl !== ""
          ? `[${minDiscountFromUrl},${maxDiscountFromUrl}]`
          : `[${minDiscountFromUrl},null]`;
      discountFilter.values.forEach((option: any) => {
        const shouldBeSelected = option.apiValue === urlDiscountKey;
        const isSelected = !!selectedFilters[option.id];
        if (shouldBeSelected !== isSelected) {
          hookHandleFilterChange(
            FILTER_ID.DISCOUNT,
            option.id,
            shouldBeSelected,
            option
          );
        }
      });
    } else if (discountFilter) {
      discountFilter.values.forEach((option: any) => {
        if (selectedFilters[option.id]) {
          hookHandleFilterChange(FILTER_ID.DISCOUNT, option.id, false, option);
        }
      });
    }
  }, [
    collectionParamKey,
    productTypeParamKey,
    includeOutOfStockFromUrl,
    priceParamKey,
    discountParamKey,
    minPriceFromUrl,
    maxPriceFromUrl,
    minDiscountFromUrl,
    maxDiscountFromUrl,
    dynamicFilters,
    selectedFilters,
    hookHandleFilterChange,
    searchParams,
  ]);

  const handleFilterRemove = (_filterId: string, optionId: string) => {
    let foundFilter: any = null;
    let foundOption: any = null;

    dynamicFilters.forEach((filter) => {
      filter.values.forEach((option) => {
        if (option.id === optionId || option.label === optionId) {
          foundFilter = filter;
          foundOption = option;
        }
      });
    });

    if (foundFilter && foundOption) {
      hookHandleFilterChange(
        foundFilter.id,
        foundOption.id,
        false,
        foundOption
      );
    }
  };

  const hasMore =
    !!searchResults &&
    !!searchResults.pagination &&
    page < (searchResults.pagination.totalPages || totalPages);

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    loading: isSearchLoading,
    onLoadMore: () => {
      setPage((prev) => {
        const next = prev + 1;
        const maxPages =
          searchResults?.pagination?.totalPages || totalPages || 1;
        return next > maxPages ? prev : next;
      });
    },
  });

  return (
    <Box className="bg-white min-h-[561px] md:min-h-[745px]">
      <div className={SEARCH_PAGE_CONTAINER_MARGIN_CLASS}>
        {/* No-results state: stay on NoResultPage while loading new query (no shimmer) */}
        {searchResults && searchResults.products.length === 0 ? (
          <NoResultPage
            query={searchQuery}
            settings={{
              noResultsMessage:
                settings?.noResultsMessage ||
                "We're sorry. There are no results for",
              suggestionMessage:
                settings?.suggestionMessage ||
                "PLEASE CHECK THE SPELLING OR TRY AGAIN WITH A LESS SPECIFIC OR DIFFERENT TERM.",
              bestsellingProductsTitle:
                settings?.bestsellingProductsTitle ||
                "HERE ARE SOME OF OUR BESTSELLING PRODUCTS",
            }}
          />
        ) : (
          <>
            {/* Mobile Filter and Sort Bar */}
            <div className="min-[769px]:hidden mb-4 min-[768px]:max-[768px]:px-[9px]">
              <Flex className="items-center !justify-between mb-[15px] py-[4.5px]">
                {/* Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex items-center gap-2 px-2 py-1.5 border border-faq-border rounded-[10px] bg-white"
                >
                  <svg
                    className="w-[20] h-5 text-black"
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
                  <Text className="!text-xs !font-medium !text-black">
                    {settings?.filterText || "FILTER"}
                  </Text>
                </button>

                {/* Sort Button */}
                <DesktopSortDropdown
                  selectedSort={selectedSort}
                  onSortChange={handleSortChange}
                  className="min-[769px]:hidden"
                  showSortOnly={true}
                />
              </Flex>
              <Flex className="items-center justify-between mb-[15px]">
                <Text className="!text-sm !text-black flex items-center justify-center">
                  {settings?.showingText || "Showing"}{" "}
                  {searchResults?.totalHits || 0}{" "}
                  {settings?.resultsText || "Result(s)"}{" "}
                  {settings?.forText || "for"} "{searchQuery}"
                </Text>
              </Flex>
            </div>

            <Flex className="gap-[15px] lg:gap-8">
              {/* Desktop Filter Sidebar: shimmer only during whole-page (initial) load */}
              <div className="hidden min-[769px]:block w-[260px] flex-shrink-0">
                {isSearchLoading &&
                (searchResults?.products?.length ?? 0) === 0 ? (
                  <ShimmerFilterSideBar />
                ) : (
                  <FilterSideBar
                    textFacets={textFacets}
                    numericFacets={numericFacets}
                    onFilterChange={hookHandleFilterChange}
                    selectedFilters={selectedFilters}
                    dynamicFilters={dynamicFilters}
                    clearAllFilters={resetFilters}
                    settings={{
                      filterByText: settings?.filterByText || "FILTER",
                      clearAllText: settings?.clearAllText || "Remove all",
                    }}
                  />
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {searchResults && (
                  <SelectedFilters
                    selectedFilters={selectedFilters}
                    dynamicFilters={dynamicFilters}
                    onFilterRemove={handleFilterRemove}
                    onClearAll={resetFilters}
                    clearAllLabel={settings?.clearAllText || "Remove all"}
                    className="mb-4"
                  />
                )}

                {/* Desktop Search Results Header */}
                {searchResults && (
                  <div className="hidden min-[769px]:block">
                    <Flex className="items-center !justify-between mb-5">
                      <Text className="!text-sm !text-black flex items-center justify-center">
                        {settings?.showingText || "Showing"}{" "}
                        {searchResults.totalHits}{" "}
                        {settings?.resultsText || "Result(s)"}{" "}
                        {settings?.forText || "for"} "{searchQuery}"
                      </Text>

                      {/* Desktop Sort Dropdown */}
                      <DesktopSortDropdown
                        selectedSort={selectedSort}
                        onSortChange={handleSortChange}
                      />
                    </Flex>
                  </div>
                )}

                {/* Products Grid: show loaded products, or shimmer only when no products yet */}
                <div className="grid grid-cols-2 min-[767px]:grid-cols-3 lg:grid-cols-4">
                  {(searchResults?.products?.length ?? 0) > 0
                    ? searchResults.products.map((product: any) => {
                        const mappedProduct =
                          mapSearchProductToProductResponse(product);
                        const {
                          productAddToCart,
                          productIncrement,
                          productDecrement,
                        } = createProductCartHandlers(
                          mappedProduct,
                          handleAddToCart,
                          incrementQuantity,
                          decrementQuantity
                        );

                        return (
                          <SearchProductCard
                            key={product.id}
                            product={mappedProduct}
                            onAddToCart={productAddToCart}
                            onIncrement={productIncrement}
                            onDecrement={productDecrement}
                            isInCart={isInCart(mappedProduct)}
                            cartItem={getCartItem(mappedProduct)}
                            isQuantityLoading={isProductLoading(mappedProduct)}
                            settings={{
                              actionButtonText: settings?.actionButtonText,
                              actionButtonTextMobile:
                                settings?.actionButtonTextMobile,
                              soldOutText: settings?.soldOutText,
                              soldOutTextMobile: settings?.soldOutTextMobile,
                            }}
                            searchProductCard={true}
                          />
                        );
                      })
                    : isSearchLoading
                      ? Array.from({ length: 6 }).map((_, index) => (
                          <ShimmerProductCard
                            key={`shimmer-${index}`}
                            className="h-full rounded-none min-[769px]:rounded-2xl"
                            settings={{
                              cardLayoutSettings: {
                                backgroundColor: "white",
                                borderRadius: "0",
                                padding: "8px",
                                border: "none",
                              },
                            }}
                          />
                        ))
                      : null}
                </div>
                {!isInitialLoad &&
                  isSearchLoading &&
                  (searchResults?.products?.length ?? 0) > 0 && (
                    <SearchLoadingSpinner />
                  )}

                {/* End-of-results message */}
                {!isInitialLoad &&
                  !isSearchLoading &&
                  searchResults &&
                  searchResults.products?.length > 0 &&
                  !hasMore && (
                    <div className="flex justify-center">
                      <div className="bg-white text-black text-sm px-2.5 py-[7px] mb-2.5 font-medium mt-5 md:mt-0">
                        No More Results
                      </div>
                    </div>
                  )}

                <div ref={sentinelRef} className="h-px w-full" />
              </div>
            </Flex>

            {/* Mobile Filter Modal */}
            <MobileFilterBar
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
              onApply={() => {
                setIsMobileFilterOpen(false);
              }}
              textFacets={textFacets}
              numericFacets={numericFacets}
              onFilterChange={hookHandleFilterChange}
              selectedFilters={selectedFilters}
              dynamicFilters={dynamicFilters}
              clearAllFilters={resetFilters}
              settings={{
                filterText: settings?.filterText || "FILTER",
                clearAllText: settings?.clearAllText || "Remove all",
                closeText: settings?.closeText || "Close",
                applyText: settings?.applyText || "Apply",
                noOptionsAvailableText:
                  settings?.noOptionsAvailableText || "No options available",
              }}
            />
          </>
        )}
      </div>
    </Box>
  );
};

export default SearchPageWrapper;
