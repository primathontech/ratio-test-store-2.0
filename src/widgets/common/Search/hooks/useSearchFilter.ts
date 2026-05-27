"use client";

import { useMemo, useState } from "react";
import type { IFilter } from "../types";
import { AVAILABILITY_FILTER, FILTER_ID } from "../constants/search-constants";

const CURRENCY_SYMBOL = "₹";

function generateCollectionSlug(raw: string): string {
  if (!raw) {
    return "";
  }
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export type CollectionDetail = { handle: string; title: string };

interface UseSearchFilterProps {
  textFacets: Record<string, any>;
  numericFacets: Record<string, any>;
  collectionDetails?: CollectionDetail[];
  onFilterChange?: (
    filterId: string,
    optionId: string,
    checked: boolean
  ) => void;
  onClearAll?: () => void;
}

interface FilterItem {
  id: string;
  label: string;
  count: number;
  input: string;
  apiValue?: string;
}

export const useSearchFilter = ({
  textFacets = {},
  numericFacets = {},
  onFilterChange,
  onClearAll,
}: UseSearchFilterProps) => {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, boolean>
  >({});
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    [FILTER_ID.PRODUCT_TYPE]: true,
    [FILTER_ID.PRICE]: true,
    [FILTER_ID.DISCOUNT]: true,
    [FILTER_ID.AVAILABILITY]: true,
  });

  const sortFilterValues = (values: FilterItem[]): FilterItem[] => {
    return values.sort((a, b) => {
      const aSelected = selectedFilters[a.id] || false;
      const bSelected = selectedFilters[b.id] || false;

      if (aSelected && !bSelected) {
        return -1;
      }
      if (!aSelected && bSelected) {
        return 1;
      }

      if (aSelected && bSelected) {
        const aOrder = selectionOrder.indexOf(a.id);
        const bOrder = selectionOrder.indexOf(b.id);
        return aOrder - bOrder;
      }

      return a.label.localeCompare(b.label);
    });
  };

  const capitalizeText = (text: string): string => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatPriceLabel = (min: number, max: number | null): string => {
    if (min === 0 && max !== null) {
      return `Below ${CURRENCY_SYMBOL}${max}`;
    }
    if (max !== null) {
      return `${CURRENCY_SYMBOL}${min} – ${CURRENCY_SYMBOL}${max}`;
    }
    return `${CURRENCY_SYMBOL}${min} & Above`;
  };

  const createCollectionsFilter = (): IFilter | null => {
    if (
      !textFacets.st_newcollections ||
      !Array.isArray(textFacets.st_newcollections)
    ) {
      return null;
    }

    const values = textFacets.st_newcollections.map((item: any) => {
      const label = (item.label ?? "").trim();
      const handle = (item.handle ?? "").trim();
      const apiValue = handle;
      return {
        id: `collections-${apiValue}`,
        apiValue,
        label: capitalizeText(label),
        input: "",
        count: item.value ?? 0,
      };
    });

    return {
      id: FILTER_ID.COLLECTIONS,
      label: "Collections",
      type: "LIST",
      values: sortFilterValues(values),
    };
  };

  const createProductTypeFilter = (): IFilter | null => {
    if (!textFacets.product_type || !Array.isArray(textFacets.product_type)) {
      return null;
    }

    const values = textFacets.product_type.map((item: any) => {
      const rawLabel = item.label;
      return {
        id: `product-type-${generateCollectionSlug(rawLabel)}`,
        apiValue: rawLabel,
        label: rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1),
        input: "",
        count: item.value,
      };
    });

    return {
      id: FILTER_ID.PRODUCT_TYPE,
      label: "Product Type",
      type: "LIST",
      values: sortFilterValues(values),
    };
  };

  const createPriceFilter = (): IFilter | null => {
    if (
      !numericFacets.discounted_price ||
      !Array.isArray(numericFacets.discounted_price)
    ) {
      return null;
    }

    const values = numericFacets.discounted_price
      .filter((item: any) => item.count > 0)
      .map((item: any) => {
        const max = item.max ?? null;
        const minDisplay = item.minDisplay ?? item.min / 100;
        const maxDisplay = item.maxDisplay ?? (max != null ? max / 100 : null);
        const id =
          max !== null ? `price-${item.min}-${max}` : `price-${item.min}-above`;
        const apiValue =
          max !== null ? `${item.min},${max}` : `${item.min},null`;
        return {
          id,
          apiValue,
          label: formatPriceLabel(minDisplay, maxDisplay),
          input: "",
          count: item.count,
        };
      });

    return {
      id: FILTER_ID.PRICE,
      label: "Price",
      type: "LIST",
      values,
    };
  };

  const createDiscountFilter = (): IFilter | null => {
    if (!numericFacets.discount || !Array.isArray(numericFacets.discount)) {
      return null;
    }

    const values = numericFacets.discount
      .filter((item: any) => item.count > 0)
      .map((item: any) => ({
        id: `discount-[${item.min},${item.max}]`,
        apiValue: `[${item.min},${item.max}]`,
        label: `${item.min}% Off Or More`,
        input: "",
        count: item.count,
      }));

    return {
      id: FILTER_ID.DISCOUNT,
      label: "Discount",
      type: "LIST",
      values,
    };
  };

  const dynamicFilters = useMemo((): IFilter[] => {
    const filters: IFilter[] = [];

    const collectionsFilter = createCollectionsFilter();
    if (collectionsFilter) {
      filters.push(collectionsFilter);
    }

    const productTypeFilter = createProductTypeFilter();
    if (productTypeFilter) {
      filters.push(productTypeFilter);
    }

    const priceFilter = createPriceFilter();
    if (priceFilter) {
      filters.push(priceFilter);
    }

    const discountFilter = createDiscountFilter();
    if (discountFilter) {
      filters.push(discountFilter);
    }

    filters.push(AVAILABILITY_FILTER);

    return filters;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textFacets, numericFacets, selectedFilters, selectionOrder]);

  const handleFilterChange = (
    filterId: string,
    optionId: string,
    checked: boolean,
    option?: any
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [optionId]: checked,
    }));

    setSelectionOrder((prev) => {
      if (checked) {
        const filtered = prev.filter((id) => id !== optionId);
        return [optionId, ...filtered];
      }
      return prev.filter((id) => id !== optionId);
    });
    if (onFilterChange) {
      const apiValue = option?.apiValue || optionId;
      onFilterChange(filterId, apiValue, checked);
    }
  };

  const toggleSection = (filterId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSelectionOrder([]);
    if (onClearAll) {
      onClearAll();
    }
  };

  const hasActiveFilters = Object.values(selectedFilters).some(Boolean);

  return {
    dynamicFilters,
    selectedFilters,
    collapsedSections,
    hasActiveFilters,
    handleFilterChange,
    toggleSection,
    clearAllFilters,
  };
};
