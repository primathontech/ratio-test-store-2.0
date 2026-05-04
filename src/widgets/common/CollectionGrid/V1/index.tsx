"use client";

import React, { memo, useState, useCallback, useEffect, useRef } from "react";
import { CollectionGridProps, FilterGroup, SortOption } from "../types";
import { ProductCard } from "@/ui/components/ProductCard";
import { ProductCardProduct } from "@/ui/components/ProductCard/types";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const FilterIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.3999 2.80002L6.9999 2.80002M1.3999 7.00002H6.9999M6.9999 7.00002V8.40002M6.9999 7.00002V5.60002M1.3999 11.2H4.1999M6.9999 11.2L12.5999 11.2M9.7999 7.00002H12.5999M9.7999 2.80002L12.5999 2.80002M9.7999 2.80002V4.20002M9.7999 2.80002V1.40002M4.5499 12.6V9.80002"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortMobileIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.84069 3.86594H12.8332M7.84069 6.67456H11.4067M7.84069 9.48318H9.98033M3.38646 3.5V10.5M3.38646 10.5L1.1665 8.36017M3.38646 10.5L5.69119 8.36017"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="9"
    viewBox="0 0 12 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transition: "transform 0.2s",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
    }}
  >
    <path
      d="M1 3L6 8L11 3"
      stroke="#1D1D1D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FilterAccordionChevron = ({ open }: { open: boolean }) => (
  <svg
    width="11"
    height="7"
    viewBox="0 0 11 7"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transition: "transform 0.2s",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
    }}
  >
    <path d="M11 5.5L5.5 6.55868e-08L-6.55868e-08 5.5L0.97625 6.47625L5.5 1.9525L10.0238 6.47625L11 5.5Z" />
  </svg>
);

const CheckmarkIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    role="presentation"
    focusable="false"
  >
    <path fill="currentColor" d="M9 20l-7-7 3-3 4 4L19 4l3 3z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 5L5 15M5 5L15 15"
      stroke="#1D1D1D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Default data                                                       */
/* ------------------------------------------------------------------ */

const DEFAULT_FILTER_GROUPS: FilterGroup[] = [
  {
    label: "Product Type",
    paramName: "filter.p.product_type",
    options: [
      { label: "5 Min", value: "5 Min" },
      { label: "Combos", value: "Combos" },
      { label: "Kits", value: "Kits" },
      { label: "Shampoo", value: "Shampoo" },
    ],
  },
  {
    label: "Shop by concern",
    paramName: "filter.p.concern",
    options: [{ label: "Hair Fall", value: "Hair Fall" }],
  },
];

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { label: "Relevance", value: "manual" },
  { label: "Price (low to high)", value: "price-ascending" },
  { label: "Price (high to low)", value: "price-descending" },
  { label: "What's new", value: "created-descending" },
];

const DEFAULT_PRODUCTS: ProductCardProduct[] = [
  {
    href: "/products/hair-fall-control-shampoo-with-pea-protein-caffeine-for-stronger-hair-300-ml",
    title:
      "Hair Fall Control Shampoo with Pea Protein & Caffeine for Stronger Hair - 300 ml",
    alt: "Hair Fall Control Shampoo with Pea Protein & Caffeine for Stronger Hair - 300 ml",
    mainImage:
      "https://bblunt.com/cdn/shop/files/hair-fall-shampoo_69341926-cb62-4e2d-8239-0fce759cf547.jpg?v=1734415120&width=360",
    hoverImage:
      "https://bblunt.com/cdn/shop/files/2_24.jpg?v=1734415120&width=360",
    category: "Shampoo",
    badge: "Get3@₹799",
    badgeVariant: "trending",
    rating: 4.77,
    reviewCount: 657,
    salePrice: 355,
    weight: "300ml",
    description: "Reduces Up to 93% Hair Fall| Adds Shine",
  },
  {
    href: "/products/intense-moisture-shampoo-with-jojoba-and-vitamin-e-for-dry-frizzy-hair-300-ml",
    title:
      "Intense Moisture Shampoo with Jojoba and Vitamin E for Dry & Frizzy Hair - 300 ml",
    alt: "Intense Moisture Shampoo with Jojoba and Vitamin E",
    mainImage:
      "https://bblunt.com/cdn/shop/files/1_dc6be4be-5a88-4263-96af-67d665175259.jpg?v=1756459247&width=360",
    hoverImage:
      "https://bblunt.com/cdn/shop/files/2_copy.jpg?v=1757052801&width=360",
    category: "Shampoo",
    badge: "Get3@₹799",
    badgeVariant: "trending",
    rating: 4.68,
    reviewCount: 517,
    salePrice: 399,
    weight: "300ml",
    description: "Moisturises & Hydrates | Adds Shine",
  },
  {
    href: "/products/advanced-smoothening-shampoo-with-keratin-hyaluronic-acid-300ml",
    title:
      "Advanced Smoothening Shampoo with Keratin & Hyaluronic Acid - 300ml",
    alt: "Advanced Smoothening Shampoo with Keratin & Hyaluronic Acid - 300ml",
    mainImage:
      "https://bblunt.com/cdn/shop/files/shoot_9bc470f2-31ca-4cde-a23e-2c1b301d97cd.jpg?v=1734421428&width=360",
    hoverImage:
      "https://bblunt.com/cdn/shop/files/1_1_68.jpg?v=1734421428&width=360",
    category: "Shampoo",
    badge: "Get3@₹799",
    badgeVariant: "trending",
    rating: 4.75,
    reviewCount: 190,
    salePrice: 355,
    weight: "300ml",
    description:
      "Smoother Hair for Upto 72 Hours* | Gently Cleanses | Adds Spectacular Shine",
  },
  {
    href: "/products/hair-fall-control-shampoo-conditioner-combo-for-stronger-hair",
    title: "Hair Fall Control Shampoo & Conditioner Combo for Stronger Hair",
    alt: "Hair Fall Control Shampoo & Conditioner Combo for Stronger Hair",
    mainImage:
      "https://bblunt.com/cdn/shop/files/hair-fall-shampoo-_-conditioner_023dc9d0-d130-4a10-812e-b53a1fdafffc.jpg?v=1734354119&width=360",
    hoverImage:
      "https://bblunt.com/cdn/shop/files/2_34.jpg?v=1734354119&width=360",
    category: "Combos",
    badge: "Bestseller",
    badgeVariant: "bestseller",
    rating: 4.82,
    reviewCount: 438,
    salePrice: 603,
    originalPrice: 754,
    discount: "20% off",
    weight: "Pack of 2",
    description: "Controls Hair Fall | Strengthens & Nourishes Hair",
  },
  {
    href: "/products/anti-dandruff-shampoo-for-clean-healthy-scalp-300ml",
    title: "Anti-Dandruff Shampoo For a Clean & Healthy Scalp 300ml",
    alt: "Anti-Dandruff Shampoo For a Clean & Healthy Scalp 300ml",
    mainImage:
      "https://bblunt.com/cdn/shop/files/bblunt-Anti-Dandruff-Shampoo-Product-shoot.jpg?v=1734338766&width=360",
    hoverImage:
      "https://bblunt.com/cdn/shop/files/2_22.jpg?v=1734338766&width=360",
    category: "Shampoo",
    badge: "Get3@₹799",
    badgeVariant: "trending",
    rating: 4.65,
    reviewCount: 230,
    salePrice: 355,
    weight: "300ml",
    description: "Reduces Dandruff Up to 100% | Leaves No Residue",
  },
  {
    href: "/products/refresh-dry-shampoo",
    title:
      "Refresh Dry Shampoo to Instantly Refresh & Add Volume to Hair - 150 ml",
    alt: "Refresh Dry Shampoo to Instantly Refresh & Add Volume to Hair - 150 ml",
    mainImage:
      "https://bblunt.com/cdn/shop/files/5.1_b0fc31e2-ba28-48da-86d4-a539f1e4be3e.jpg?v=1738656252&width=360",
    hoverImage:
      "https://bblunt.com/cdn/shop/files/5.2_8f7aa3c4-c5ec-4ba3-a32a-dbed5b116be1.jpg?v=1738656252&width=360",
    category: "Shampoo",
    badge: "Get3@₹999",
    badgeVariant: "trending",
    rating: 4.5,
    reviewCount: 180,
    salePrice: 550,
    weight: "150ml",
    description: "Sulphate-Free | Leaves No Residue",
  },
  {
    href: "/products/intense-moisture-shampoo-conditioner-combo",
    title: "Intense Moisture Shampoo & Conditioner Power Duo",
    alt: "Intense Moisture Shampoo & Conditioner Power Duo",
    mainImage:
      "https://bblunt.com/cdn/shop/files/intense-moisture-shampoo-_-conditioner.jpg?v=1734354093&width=360",
    hoverImage:
      "https://bblunt.com/cdn/shop/files/2_33.jpg?v=1734354093&width=360",
    category: "Combos",
    badge: "Bestseller",
    badgeVariant: "bestseller",
    rating: 4.7,
    reviewCount: 320,
    salePrice: 649,
    originalPrice: 812,
    discount: "20% off",
    weight: "Pack of 2",
    description: "Moisturises & Hydrates | Colour",
  },
  {
    href: "/products/hair-fall-control-kit",
    title: "Hair Fall Control Kit",
    alt: "Hair Fall Control Kit",
    mainImage:
      "https://bblunt.com/cdn/shop/files/hair-fall-kit.jpg?v=1734354000&width=360",
    hoverImage:
      "https://bblunt.com/cdn/shop/files/2_35.jpg?v=1734354000&width=360",
    category: "Kits",
    badge: "-30%Off+Gift",
    badgeVariant: "deal",
    rating: 4.8,
    reviewCount: 156,
    salePrice: 899,
    originalPrice: 1285,
    discount: "30% off",
    weight: "Pack of 3",
    description: "Reduces Up to 93% Hair Fall",
  },
];

/* ------------------------------------------------------------------ */
/*  Filter Sidebar (Desktop)                                           */
/* ------------------------------------------------------------------ */

const FilterSidebar = memo(function FilterSidebar({
  filterGroups,
  selectedFilters,
  onFilterChange,
}: {
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (paramName: string, value: string) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    filterGroups.forEach((g) => {
      initial[g.paramName] = true;
    });
    return initial;
  });

  const toggleGroup = useCallback((paramName: string) => {
    setOpenGroups((prev) => ({ ...prev, [paramName]: !prev[paramName] }));
  }, []);

  return (
    <aside className="hidden lg:block sticky top-[120px] self-start w-[240px] flex-shrink-0 pr-[20px]">
      <h2
        className="text-[18px] leading-[24px] mb-[16px]"
        style={{ fontWeight: 500, color: "#1d1d1d" }}
      >
        Filters
      </h2>

      {filterGroups.map((group) => {
        const isOpen = openGroups[group.paramName] !== false;
        const selected = selectedFilters[group.paramName] || [];

        return (
          <div
            key={group.paramName}
            className="border-t border-[#e0e0e0] py-[12px]"
          >
            <button
              type="button"
              className="flex items-center justify-between w-full text-left cursor-pointer"
              onClick={() => toggleGroup(group.paramName)}
              aria-expanded={isOpen}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <span
                className="text-[14px]"
                style={{ fontWeight: 500, color: "#1d1d1d" }}
              >
                {group.label}
              </span>
              <FilterAccordionChevron open={isOpen} />
            </button>

            {isOpen && (
              <ul className="mt-[8px] list-none p-0 m-0">
                {group.options.map((option) => {
                  const isChecked = selected.includes(option.value);
                  return (
                    <li key={option.value} className="mb-[6px]">
                      <label className="flex items-center gap-[8px] cursor-pointer text-[14px]">
                        <span
                          className="inline-flex items-center justify-center w-[18px] h-[18px] border flex-shrink-0"
                          style={{
                            borderColor: isChecked ? "#1d1d1d" : "#cccccc",
                            backgroundColor: isChecked
                              ? "#1d1d1d"
                              : "transparent",
                            borderRadius: "2px",
                            transition: "all 0.15s",
                          }}
                        >
                          {isChecked && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M9 20l-7-7 3-3 4 4L19 4l3 3z"
                                fill="#ffffff"
                              />
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() =>
                            onFilterChange(group.paramName, option.value)
                          }
                        />
                        <span style={{ color: "#1d1d1d", fontWeight: 400 }}>
                          {option.label}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
});

/* ------------------------------------------------------------------ */
/*  Mobile Filter Drawer                                               */
/* ------------------------------------------------------------------ */

const MobileFilterDrawer = memo(function MobileFilterDrawer({
  isOpen,
  onClose,
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearAll,
  totalProducts,
}: {
  isOpen: boolean;
  onClose: () => void;
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (paramName: string, value: string) => void;
  onClearAll: () => void;
  totalProducts: number;
}) {
  const [activeGroup, setActiveGroup] = useState(
    filterGroups[0]?.paramName || ""
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const currentGroup = filterGroups.find((g) => g.paramName === activeGroup);

  return (
    <div className="fixed inset-0 z-[999] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{
          backgroundColor: "#ffffff",
          maxHeight: "80vh",
          borderRadius: "12px 12px 0 0",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[#e0e0e0]">
          <h3
            className="text-[18px]"
            style={{ fontWeight: 500, color: "#1d1d1d" }}
          >
            Filter
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer"
            style={{ background: "none", border: "none" }}
            aria-label="Close filter drawer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: group names */}
          <div
            className="w-[140px] flex-shrink-0 overflow-y-auto border-r border-[#e0e0e0]"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            {filterGroups.map((group) => (
              <button
                key={group.paramName}
                type="button"
                className="w-full text-left px-[16px] py-[14px] text-[14px] cursor-pointer"
                style={{
                  background:
                    activeGroup === group.paramName ? "#ffffff" : "transparent",
                  border: "none",
                  borderLeft:
                    activeGroup === group.paramName
                      ? "3px solid #1d1d1d"
                      : "3px solid transparent",
                  fontWeight: activeGroup === group.paramName ? 500 : 400,
                  color: "#1d1d1d",
                }}
                onClick={() => setActiveGroup(group.paramName)}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* Right: checkboxes */}
          <div className="flex-1 overflow-y-auto px-[16px] py-[12px]">
            {currentGroup?.options.map((option) => {
              const selected = selectedFilters[currentGroup.paramName] || [];
              const isChecked = selected.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-[10px] py-[10px] cursor-pointer text-[14px]"
                >
                  <span
                    className="inline-flex items-center justify-center w-[20px] h-[20px] border flex-shrink-0"
                    style={{
                      borderColor: isChecked ? "#1d1d1d" : "#cccccc",
                      backgroundColor: isChecked ? "#1d1d1d" : "transparent",
                      borderRadius: "3px",
                    }}
                  >
                    {isChecked && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M9 20l-7-7 3-3 4 4L19 4l3 3z" fill="#ffffff" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() =>
                      onFilterChange(currentGroup.paramName, option.value)
                    }
                  />
                  <span
                    style={{
                      color: "#1d1d1d",
                      fontWeight: 400,
                    }}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer bar */}
        <div
          className="flex items-center justify-between px-[16px] py-[12px] border-t border-[#e0e0e0]"
          style={{ backgroundColor: "#ffffff" }}
        >
          <button
            type="button"
            className="text-[14px] cursor-pointer"
            style={{
              background: "none",
              border: "none",
              color: "#666666",
              fontWeight: 400,
            }}
            onClick={onClearAll}
          >
            Clear all
          </button>
          <button
            type="button"
            className="px-[24px] py-[10px] text-[14px] cursor-pointer"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "0px",
              fontWeight: 500,
            }}
            onClick={onClose}
          >
            Show {totalProducts} results
          </button>
        </div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Sort Dropdown (Desktop)                                            */
/* ------------------------------------------------------------------ */

const SortDropdown = memo(function SortDropdown({
  sortOptions,
  selectedSort,
  onSortChange,
}: {
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    sortOptions.find((o) => o.value === selectedSort)?.label || "Sort by";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-[8px] cursor-pointer text-[14px]"
        style={{
          background: "none",
          border: "none",
          color: "#1d1d1d",
          fontWeight: 400,
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Mobile: just icons */}
        <span className="hidden lg:inline">Sort by</span>
        <span className="lg:hidden">
          <SortMobileIcon />
        </span>
        <span className="hidden lg:inline">
          <SortChevronIcon open={isOpen} />
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-[4px] z-[50] min-w-[200px] py-[8px]"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          role="listbox"
        >
          {sortOptions.map((option) => {
            const isSelected = option.value === selectedSort;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className="flex items-center gap-[8px] w-full px-[16px] py-[8px] text-left text-[14px] cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "#1d1d1d",
                  fontWeight: isSelected ? 500 : 400,
                }}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span
                  className="inline-flex items-center justify-center w-[16px] h-[16px] border flex-shrink-0"
                  style={{
                    borderColor: isSelected ? "#1d1d1d" : "#cccccc",
                    borderRadius: "50%",
                    borderWidth: "1.5px",
                  }}
                >
                  {isSelected && (
                    <span
                      className="block w-[8px] h-[8px]"
                      style={{
                        backgroundColor: "#1d1d1d",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Mobile Sort Drawer                                                 */
/* ------------------------------------------------------------------ */

const MobileSortDrawer = memo(function MobileSortDrawer({
  isOpen,
  onClose,
  sortOptions,
  selectedSort,
  onSortChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (value: string) => void;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] lg:hidden">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-0 right-0 py-[16px]"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <div className="flex items-center justify-between px-[16px] pb-[12px] border-b border-[#e0e0e0]">
          <h3
            className="text-[16px]"
            style={{ fontWeight: 500, color: "#1d1d1d" }}
          >
            Sort by
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer"
            style={{ background: "none", border: "none" }}
            aria-label="Close sort drawer"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="px-[16px] pt-[8px]">
          {sortOptions.map((option) => {
            const isSelected = option.value === selectedSort;
            return (
              <button
                key={option.value}
                type="button"
                className="flex items-center gap-[10px] w-full py-[12px] text-left text-[14px] cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "#1d1d1d",
                  fontWeight: isSelected ? 500 : 400,
                }}
                onClick={() => {
                  onSortChange(option.value);
                  onClose();
                }}
              >
                <span
                  className="inline-flex items-center justify-center w-[18px] h-[18px] border flex-shrink-0"
                  style={{
                    borderColor: isSelected ? "#1d1d1d" : "#cccccc",
                    borderRadius: "50%",
                    borderWidth: "1.5px",
                  }}
                >
                  {isSelected && (
                    <span
                      className="block w-[10px] h-[10px]"
                      style={{
                        backgroundColor: "#1d1d1d",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Mobile Chips Bar                                                   */
/* ------------------------------------------------------------------ */

const MobileChipsBar = memo(function MobileChipsBar({
  filterGroups,
  selectedFilters,
  onFilterChipClick,
  onFilterOpen,
  onSortOpen,
}: {
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChipClick: (paramName: string, value: string) => void;
  onFilterOpen: () => void;
  onSortOpen: () => void;
}) {
  // Flatten filter options into chip-able items
  const allOptions = filterGroups.flatMap((g) =>
    g.options.map((o) => ({ ...o, paramName: g.paramName }))
  );

  return (
    <div
      className="lg:hidden flex items-center gap-[8px] overflow-x-auto pb-[8px] mb-[12px] scrollbar-none"
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Filter button */}
      <button
        type="button"
        className="flex items-center gap-[6px] flex-shrink-0 px-[12px] py-[8px] text-[13px] cursor-pointer"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "20px",
          color: "#1d1d1d",
          fontWeight: 400,
        }}
        onClick={onFilterOpen}
      >
        <span>Filter</span>
        <FilterIcon />
      </button>

      {/* Sort button */}
      <button
        type="button"
        className="flex items-center gap-[6px] flex-shrink-0 px-[12px] py-[8px] text-[13px] cursor-pointer"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "20px",
          color: "#1d1d1d",
          fontWeight: 400,
        }}
        onClick={onSortOpen}
      >
        <span>Sort by</span>
        <SortMobileIcon />
      </button>

      {/* Quick filter chips */}
      {allOptions.map((opt) => {
        const selected = (selectedFilters[opt.paramName] || []).includes(
          opt.value
        );
        return (
          <button
            key={`${opt.paramName}-${opt.value}`}
            type="button"
            className="flex-shrink-0 px-[12px] py-[8px] text-[13px] cursor-pointer"
            style={{
              backgroundColor: selected ? "#1d1d1d" : "#ffffff",
              color: selected ? "#ffffff" : "#1d1d1d",
              border: "1px solid #e0e0e0",
              borderRadius: "20px",
              fontWeight: 400,
              transition: "all 0.15s",
            }}
            onClick={() => onFilterChipClick(opt.paramName, opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: CollectionGridProps) {
  const products = settings?.products || DEFAULT_PRODUCTS;
  const filterGroups = settings?.filterGroups || DEFAULT_FILTER_GROUPS;
  const sortOptions = settings?.sortOptions || DEFAULT_SORT_OPTIONS;
  const defaultSort = settings?.defaultSort || "manual";
  const productCountLabel =
    settings?.productCountLabel || `${products.length} products found for you`;

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [selectedSort, setSelectedSort] = useState(defaultSort);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  const handleFilterChange = useCallback((paramName: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[paramName] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [paramName]: next };
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedFilters({});
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSelectedSort(value);
  }, []);

  // Filter products based on selected filters
  const filteredProducts = React.useMemo(() => {
    const activeFilters = Object.entries(selectedFilters).filter(
      ([, values]) => values.length > 0
    );
    if (activeFilters.length === 0) {
      return products;
    }

    return products.filter((product) => {
      return activeFilters.every(([, values]) => {
        // Match against category
        return values.includes(product.category);
      });
    });
  }, [products, selectedFilters]);

  // Sort products
  const sortedProducts = React.useMemo(() => {
    const sorted = [...filteredProducts];
    switch (selectedSort) {
      case "price-ascending":
        sorted.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price-descending":
        sorted.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case "created-descending":
        // Keep original order as a proxy for "newest"
        break;
      default:
        // manual / relevance — keep original order
        break;
    }
    return sorted;
  }, [filteredProducts, selectedSort]);

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: "#ffffff",
        paddingBottom: "70px",
      }}
      aria-label="Product collection grid"
    >
      <div
        className="mx-auto px-[16px] lg:px-[20px]"
        style={{ maxWidth: "1440px" }}
      >
        {/* Mobile chips bar */}
        <MobileChipsBar
          filterGroups={filterGroups}
          selectedFilters={selectedFilters}
          onFilterChipClick={handleFilterChange}
          onFilterOpen={() => setFilterDrawerOpen(true)}
          onSortOpen={() => setSortDrawerOpen(true)}
        />

        <div className="flex gap-[20px]">
          {/* Desktop filter sidebar */}
          <FilterSidebar
            filterGroups={filterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Sort toolbar (desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-[20px]">
              <span
                className="text-[14px]"
                style={{ color: "#1d1d1d", fontWeight: 400 }}
              >
                {sortedProducts.length} products found for you
              </span>
              <SortDropdown
                sortOptions={sortOptions}
                selectedSort={selectedSort}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[12px] lg:gap-[20px]">
              {sortedProducts.map((product, idx) => (
                <ProductCard key={`${product.href}-${idx}`} product={product} />
              ))}
            </div>

            {/* Empty state */}
            {sortedProducts.length === 0 && (
              <div
                className="flex items-center justify-center py-[60px] text-[16px]"
                style={{ color: "#666666" }}
              >
                No products match the selected filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawers */}
      <MobileFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filterGroups={filterGroups}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        totalProducts={sortedProducts.length}
      />

      <MobileSortDrawer
        isOpen={sortDrawerOpen}
        onClose={() => setSortDrawerOpen(false)}
        sortOptions={sortOptions}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
      />
    </section>
  );
});
