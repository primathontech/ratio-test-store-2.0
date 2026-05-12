"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  calculateDiscountPercentage,
  getUnitPrice,
  getUnitValue,
  pickFirstString,
} from "../utils/productInfoHelpers";
import { fetchVariantNetContent } from "../utils/fetchVariantNetContent";

interface NewVariantFields {
  name: { value: string | string[]; data_type: string };
  swatch: { value: string[] | string; data_type: string };
  variant?: {
    value: Array<{
      handle:
        | string
        | {
            handle?: string;
            imageUrl?: string;
            price?: number;
            compareAtPrice?: number;
          };
    }>;
    data_type: string;
  };
}

export interface NewVariantNode {
  id: string;
  type: string;
  handle?: string;
  status?: string;
  fields: NewVariantFields;
}

export interface NewVariantPickerData {
  value: NewVariantNode[];
  data_type: string;
}

interface VariantPickerProps {
  data: NewVariantPickerData;
  fallbackImageUrl: string;
  selectedVariantId?: string;
  compareAtPrice: number;
  currentPrice: number;
  selectSizeText?: string;
  discount?: string;
  rupeeSymbol?: string;
  onVariantSelect?: (variant: NewVariantNode) => void;
}

/**
 * Variant cards row — swatch image + name + price + (optional) per-unit price.
 * Replaces the old `VariantSelector` in V1.
 *
 * Net-content for each variant is fetched lazily on mount via the project's
 * commerce client (`@/config/commerce`), and the result array stays slot-
 * aligned with `data.value` so a failed fetch doesn't shift other slots.
 *
 * The picker hides itself while the gallery's lightbox is open (body has
 * `zoom-modal-open`), since the lightbox covers the right column anyway.
 */
export function VariantPicker({
  data,
  onVariantSelect,
  fallbackImageUrl,
  selectSizeText,
  discount,
  rupeeSymbol,
  currentPrice,
  compareAtPrice,
}: VariantPickerProps) {
  const [variantNetContent, setNetContent] = useState<string[]>([]);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const variants = data?.value;
  const hasVariants = variants && variants.length > 0;
  const pathname = usePathname();

  // Stable string of handles — useEffect keys on it to avoid re-fetching
  // on every render when array identity changes.
  const handleArray = useMemo(() => {
    return (
      variants?.map((v) => {
        const raw = v?.fields?.variant?.value?.[0]?.handle;
        if (typeof raw === "string") {
          return raw;
        }
        return raw?.handle ?? "";
      }) ?? []
    );
  }, [variants]);

  useEffect(() => {
    const handlesToFetch = handleArray.filter((h) => h.length > 0);
    if (handlesToFetch.length === 0) {
      setNetContent([]);
      return;
    }

    let isMounted = true;

    fetchVariantNetContent(handlesToFetch)
      .then((results) => {
        if (!isMounted) {
          return;
        }
        // Re-align results with the original `variants` array so picker indices
        // line up with their respective net-content entries.
        const aligned: string[] = new Array(handleArray.length).fill("");
        let resultIdx = 0;
        handleArray.forEach((h, idx) => {
          if (h.length === 0) {
            return;
          }
          aligned[idx] = results[resultIdx]?.netContent ?? "";
          resultIdx++;
        });
        setNetContent(aligned);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        console.error("[VariantPicker] net content fetch failed:", error);
        setNetContent([]);
      });

    return () => {
      isMounted = false;
    };
  }, [handleArray]);

  // Track the body class so the picker hides while the gallery lightbox is up.
  useEffect(() => {
    const checkZoomState = () => {
      setIsZoomOpen(document.body.classList.contains("zoom-modal-open"));
    };
    checkZoomState();
    const observer = new MutationObserver(checkZoomState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const currentHandle = (() => {
    if (!pathname) {
      return null;
    }
    const parts = pathname.split("/");
    const productsIndex = parts.indexOf("products");
    return productsIndex !== -1 ? parts[productsIndex + 1] || null : null;
  })();

  const selectedVariantIndex = (() => {
    if (!variants) {
      return -1;
    }
    const exactMatch = variants.findIndex((v) => {
      const raw = v?.fields?.variant?.value?.[0]?.handle;
      const handle = typeof raw === "string" ? raw : (raw?.handle ?? "");
      return !!handle && handle === currentHandle;
    });
    if (exactMatch !== -1) {
      return exactMatch;
    }
    const linkless: number[] = [];
    variants.forEach((v, i) => {
      const raw = v?.fields?.variant?.value?.[0]?.handle;
      const handle = typeof raw === "string" ? raw : (raw?.handle ?? "");
      if (!handle) {
        linkless.push(i);
      }
    });
    return linkless.length === 1 ? linkless[0] : -1;
  })();

  if (isZoomOpen) {
    return null;
  }
  if (!hasVariants) {
    return null;
  }

  return (
    <div data-testid="variant-picker-container" className="flex flex-col">
      {selectSizeText && (
        <p className="text-base font-bold leading-[25.6px] text-black m-0">
          {selectSizeText}
        </p>
      )}
      <div
        data-testid="variant-picker-list"
        className="flex items-stretch gap-4 overflow-x-auto pt-3.5 pr-3 [&::-webkit-scrollbar]:hidden mb-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {variants.map((variant, ind) => {
          const name = pickFirstString(variant?.fields?.name?.value);
          const swatchValue = variant?.fields?.swatch?.value;
          const swatchImage = Array.isArray(swatchValue)
            ? swatchValue[0]
            : swatchValue;

          const variantHandleEntry =
            variant?.fields?.variant?.value?.[0]?.handle;
          const handleObj =
            typeof variantHandleEntry === "string" ? null : variantHandleEntry;

          const matchesRoute = ind === selectedVariantIndex;
          const variantImageUrl = handleObj?.imageUrl;
          const price = handleObj?.price;
          const priceInRupees =
            typeof price === "number"
              ? price / 100
              : matchesRoute
                ? currentPrice
                : 0;
          const comparedPrice = handleObj?.compareAtPrice;
          const comparedPriceInRupees =
            typeof comparedPrice === "number"
              ? comparedPrice / 100
              : matchesRoute && compareAtPrice > 0
                ? compareAtPrice
                : null;

          const variantHasDiscount =
            comparedPriceInRupees !== null &&
            comparedPriceInRupees > priceInRupees;
          const variantDiscountPercentage = variantHasDiscount
            ? calculateDiscountPercentage(comparedPriceInRupees, priceInRupees)
            : 0;

          let variantUnitWithPrice: string | null = null;
          const variantContent = variantNetContent?.[ind] ?? "";
          if (name && priceInRupees > 0) {
            const variantUnitPrice = getUnitPrice(
              priceInRupees,
              variantContent
            );
            const variantUnitValue = getUnitValue(variantContent);
            if (variantUnitPrice && variantUnitValue) {
              variantUnitWithPrice = `${variantUnitPrice} / ${variantUnitValue}`;
            }
          }

          return (
            <div
              key={variant.id}
              data-testid={`variant-card-${variant.id}`}
              onClick={() => onVariantSelect?.(variant)}
              className={`relative flex flex-row cursor-pointer p-0 rounded transition-colors flex-shrink-0 overflow-visible max-h-[105px] md:max-h-[99px] ${
                matchesRoute
                  ? "border-[1.6px] border-solid border-primary"
                  : "border-[0.8px] border-solid border-[rgba(0,0,0,0.1)]"
              }`}
            >
              {matchesRoute && (
                <div
                  data-testid={`variant-selected-icon-${variant.id}`}
                  className="absolute -top-3 -right-2 z-[10] w-5 h-5 rounded-[50%] bg-primary flex items-center justify-center"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12.5L10 17.5L19 7.5"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <div
                data-testid={`variant-swatch-wrapper-${variant.id}`}
                className="rounded-[3px] overflow-hidden flex-shrink-0 m-1"
              >
                <Image
                  src={swatchImage || variantImageUrl || fallbackImageUrl}
                  alt={name || "Color swatch"}
                  width={75}
                  height={83}
                  className="object-cover h-full border-[1.21px] max-h-[91px]"
                  style={{ borderRadius: "4px" }}
                />
              </div>

              <div
                data-testid={`variant-content-wrapper-${variant.id}`}
                className="leading-none flex-1 flex flex-col justify-between min-w-[83px] md:min-w-[90px] max-w-[150px]"
              >
                <div className="px-2">
                  <div
                    data-testid={`variant-name-${variant.id}`}
                    className="text-sm md:text-xs leading-[22.4px] md:leading-[19.2px] font-normal text-black mt-[5px] line-clamp-2 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]"
                  >
                    {name}
                  </div>
                  <div
                    data-testid={`variant-price-section-${variant.id}`}
                    className="flex items-center gap-1 flex-nowrap text-left mr-3 md:mr-4"
                  >
                    <span className="text-base font-bold leading-[25.6px] text-primary whitespace-nowrap">
                      ₹{priceInRupees}
                    </span>
                    {variantHasDiscount && (
                      <>
                        <span className="text-xs font-normal leading-[19.2px] text-surface line-through whitespace-nowrap mt-0.5">
                          {rupeeSymbol}
                          {comparedPriceInRupees}
                        </span>
                        <span className="text-xs font-medium leading-[19.2px] text-[#D6322C] whitespace-nowrap mt-0.5">
                          {variantDiscountPercentage}
                          {discount}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {variantUnitWithPrice && (
                  <div
                    data-testid={`variant-unit-price-${variant.id}`}
                    className="text-left text-xs font-bold leading-[19.2px] text-black p-2"
                  >
                    ({rupeeSymbol}
                    {variantUnitWithPrice})
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
