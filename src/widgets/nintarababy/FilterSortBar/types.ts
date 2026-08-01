import { WidgetProps } from "@/widgets/types";

/**
 * FilterSortBar widget settings
 */
export interface FilterSortBarSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Currently active sort option value */
  activeSortValue?: string;
  /** Array of available sort options */
  sortOptions?: SortOptionItem[];
  /** Text for the filter button */
  filterButtonText?: string;
  /** Label for the sort-by trigger */
  sortByLabel?: string;
  /** Text for the "Clear All" action */
  clearAllText?: string;
  /** Text for the "Apply Filters" action */
  applyFiltersText?: string;
}

/**
 * A single sort option item
 */
export interface SortOptionItem {
  /** Display label (e.g. "Price: low to high") */
  label: string;
  /** Sort value key (e.g. "price-ascending") */
  value: string;
}

/**
 * FilterSortBar widget data
 */
export interface FilterSortBarData {
  /** Array of available sort options */
  sortOptions?: SortOptionItem[];
  /** Whether the filter panel is available */
  filterEnabled?: boolean;
}

/**
 * Props for the FilterSortBar component
 */
export type FilterSortBarProps = WidgetProps<
  FilterSortBarData,
  FilterSortBarSettings
>;

/**
 * Design tokens extracted from nintarababy.in collection page
 *
 * Section: Filter + Sort toolbar above the product grid.
 * Desktop: flex row, space-between, Filter button left, Sort dropdown right.
 * Mobile: no borders on buttons, full-width flex, sort dropdown = bottom sheet.
 * Filter button: 140px min-width, 40px min-height, 1px solid #01464f border, 4px radius.
 * Sort trigger: same sizing, 4px radius, "Sort By" text + chevron icon.
 * Sort dropdown: desktop 250px positioned dropdown, mobile full-width bottom sheet.
 * All text: Figtree 16px/500 desktop, 14px/600 mobile.
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: "#01464f",
    text: "#092a33",
    background: "#ffffff",
    sortOptionHoverBg: "rgba(1, 70, 79, 0.08)",
    darkOverlay: "rgba(0, 0, 0, 0.2)",
  },
  typography: {
    fontFamily: "Figtree",
    button: {
      desktop: { fontSize: "16px", fontWeight: "500", lineHeight: "26px" },
      mobile: { fontSize: "14px", fontWeight: "600", lineHeight: "26px" },
    },
    sortOption: { fontSize: "14px", padding: "10px 15px" },
  },
  spacing: {
    toolbarMargin: "20px 0 40px",
    toolbarGap: "16px",
    buttonMinWidth: "140px",
    buttonMinHeight: "40px",
    buttonRadius: "4px",
    sortTriggerPadding: "6px 15px",
    filterIconGap: "8px",
    dropdownWidth: "250px",
    dropdownMaxHeight: "385px",
    dropdownContentPadding: "15px 0",
    dropdownOptionPadding: "10px 15px",
  },
  borders: {
    button: "1px solid #01464f",
    dropdownShadow: "0 0 20px rgb(0 0 0 / 20%)",
  },
  transitions: {
    dropdownDesktop: "opacity 0.2s ease-in-out, visibility 0.2s ease-in-out",
    dropdownMobile: "all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)",
    optionHover: "all 0.3s ease-in-out",
    chevronRotate: "transform 0.2s ease-in-out",
  },
} as const;

/**
 * Default sort options from the source site (nintarababy.in)
 */
export const DEFAULT_SORT_OPTIONS: SortOptionItem[] = [
  { label: "Default", value: "manual" },
  { label: "Price: low to high", value: "price-ascending" },
  { label: "Price: high to low", value: "price-descending" },
];

/**
 * SVG icon path data for inline icons
 */
export const ICON_PATHS = {
  filterFunnel:
    "M4.16685 6.29522C2.71525 5.20994 1.68079 4.01617 1.11595 3.34505C0.941097 3.13731 0.883806 2.98527 0.849357 2.71747C0.7314 1.80047 0.672422 1.34197 0.941306 1.04598C1.21019 0.75 1.68569 0.75 2.63669 0.75H9.36331C10.3143 0.75 10.7898 0.75 11.0587 1.04598C11.3276 1.34197 11.2686 1.80047 11.1506 2.71747C11.1162 2.98528 11.0589 3.13731 10.884 3.34506C10.3184 4.01703 9.28188 5.21291 7.82733 6.29957C7.69574 6.39788 7.609 6.5581 7.59291 6.73582C7.44882 8.32865 7.31594 9.20109 7.23323 9.64245C7.09973 10.355 6.08935 10.7837 5.54851 11.1662C5.22653 11.3939 4.83584 11.1228 4.79412 10.7704C4.71458 10.0986 4.56477 8.73372 4.40124 6.73582C4.38655 6.55646 4.2995 6.39438 4.16685 6.29522Z",
  chevronDown:
    "M0.251038 1.46324C-0.0836795 1.1285 -0.0836795 0.585791 0.251038 0.251051C0.585748 -0.0836835 1.1285 -0.0836835 1.46321 0.251051L5.99999 4.78783L10.5368 0.251051C10.8715 -0.0836835 11.4142 -0.0836835 11.7489 0.251051C12.0837 0.585791 12.0837 1.1285 11.7489 1.46324L6.60608 6.60611C6.27134 6.94084 5.72863 6.94084 5.39389 6.60611L0.251038 1.46324Z",
  closeX: "M15 0L1 14m14 0L1 0",
} as const;
