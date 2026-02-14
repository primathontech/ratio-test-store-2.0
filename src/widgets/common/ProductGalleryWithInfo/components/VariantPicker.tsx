"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { calculateDiscountPercentage } from "../utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUnitPrice, getUnitValue } from "../utils";
import { fetchProductDetails, ProductDetails } from "../fetchProductDetails";

interface NewVariantFields {
  name: {
    value: string;
    data_type: string;
  };
  swatch: {
    value: string[]; // array of image URLs
    data_type: string;
  };
  variant?: {
    value: Array<{ handle: string }>;
    data_type: string;
  };
}

interface NewVariantNode {
  id: string;
  type: string;
  handle?: string;
  status?: string;
  fields: NewVariantFields;
}

interface NewVariantPickerData {
  value: NewVariantNode[];
  data_type: string;
}
// Types are imported from api.ts, no need to redefine here

interface VariantPickerProps {
  data: NewVariantPickerData;
  fallbackImageUrl: string;
  unitWithPrice?: string;
  selectedVariantId?: string;
  compareAtPrice: number;
  currentPrice: number;
  selectSizeText?: string;
  discount?: string;
  rupeeSymbol?: string;
  productNetContent?: string | null;
  onVariantSelect?: (variant: NewVariantNode) => void;
}

export function VariantPicker({
  data,
  onVariantSelect,
  unitWithPrice,
  fallbackImageUrl,
  selectSizeText,
  selectedVariantId,
  compareAtPrice,
  currentPrice,
  discount,
  rupeeSymbol,
  productNetContent,
}: VariantPickerProps) {
  const [variantNetContent, setNetContent] = useState<string[]>([]);

  const variants = data?.value;
  const hasVariants = variants && variants.length > 0;
  const pathname = usePathname();

  // Extract handles from variants
  const handleArray =
    variants
      ?.map((v) => (v?.fields?.variant?.value?.[0]?.handle as any)?.handle)
      .filter((h): h is string => Boolean(h)) || [];
  // Fetch product details and extract net content in useEffect to prevent multiple calls
  useEffect(() => {
    if (handleArray.length === 0) {
      setNetContent([]);
      return;
    }
    let isMounted = true;
    fetchProductDetails(handleArray)
      .then((results) => {
        if (!isMounted) return;
        const netContent = results
          .filter(
            (itm): itm is PromiseFulfilledResult<ProductDetails> =>
              itm.status === "fulfilled",
          )
          .map((itm) => {
            return itm?.value?.metadata?.product_net_content?.value;
          })
          .filter((content): content is string => Boolean(content));

        setNetContent(netContent);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Error fetching variant net content:", error);
        setNetContent([]);
      });

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [handleArray.join(",")]); // Re-fetch only when handles change

  // Extract product handle from pathname (e.g., /products/example-handle -> example-handle)
  const getCurrentHandleFromPath = () => {
    if (!pathname) return null;
    const parts = pathname.split("/");
    const productsIndex = parts.indexOf("products");
    if (productsIndex !== -1 && parts[productsIndex + 1]) {
      return parts[productsIndex + 1];
    }
    return null;
  };

  const currentHandle = getCurrentHandleFromPath();
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Check if zoom modal is open by checking body class
  useEffect(() => {
    const checkZoomState = () => {
      setIsZoomOpen(document.body.classList.contains("zoom-modal-open"));
    };

    // Check initial state
    checkZoomState();

    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver(checkZoomState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleVariantClick = (variant: NewVariantNode) => {
    onVariantSelect?.(variant);
  };

  // Hide variants when zoom modal is open
  if (isZoomOpen) {
    return null;
  }

  return (
    <div data-testid="variant-picker-container" className="my-6">
      {hasVariants && (
        <>
          <p className="text-text-lg font-bold pb-[4px] border-b md:border-b border-dotted">
            {selectSizeText}
          </p>
          <div
            data-testid="variant-picker-list"
            className="flex gap-6 py-4 md:py-8 overflow-x-auto [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {variants.map((variant: any, ind: number) => {
              const name = variant?.fields?.name?.value;
              const swatchImage = variant?.fields?.swatch?.value?.[0];
              const neContent = variant?.fields?.name?.value?.[0];
              const selectedVariant =
                variant?.fields?.variant?.value?.[0]?.handle ?? null;
              const matchesRoute = selectedVariant?.handle === currentHandle;
              const price = variant?.fields?.variant?.value?.[0]?.handle?.price;
              const priceInRupees = typeof price === "number" ? price / 100 : 0;
              const comparedPrice =
                variant?.fields?.variant?.value?.[0]?.handle?.compareAtPrice;
              const comparedPriceInRupees =
                typeof comparedPrice === "number" ? comparedPrice / 100 : null;

              // Calculate discount for this variant
              const variantHasDiscount =
                comparedPriceInRupees !== null &&
                comparedPriceInRupees > priceInRupees;
              const variantDiscountPercentage = variantHasDiscount
                ? calculateDiscountPercentage(
                    comparedPriceInRupees,
                    priceInRupees,
                  )
                : 0;

              // Calculate unitWithPrice for this variant
              let variantUnitWithPrice: string | null = null;
              const variantContent = variantNetContent?.[ind] ?? "";
              if (neContent && priceInRupees > 0) {
                const variantUnitPrice = getUnitPrice(
                  priceInRupees,
                  variantContent,
                );
                const variantUnitValue = getUnitValue(variantContent);
                if (variantUnitPrice && variantUnitValue) {
                  variantUnitWithPrice = `${variantUnitPrice}/${variantUnitValue}`;
                }
              }

              return (
                <div
                  key={variant.id}
                  data-testid={`variant-card-${variant.id}`}
                  onClick={() => handleVariantClick(variant)}
                  className={`relative flex flex-row cursor-pointer p-1.5 border rounded-lg text-text-sm text-black font-semibold transition-colors flex-shrink-0 min-w-[144px] md:min-w-[174px] overflow-visible ${
                    matchesRoute
                      ? "border-[#1D1D1D] border-2"
                      : "border-gray-300"
                  }`}
                >
                  {/* Selected Variant Icon */}
                  {matchesRoute && (
                    <div
                      data-testid={`variant-selected-icon-${variant.id}`}
                      className="absolute -top-2 -right-2 z-10"
                    >
                      <Image
                        src="/dawn/svg/selected_variant.svg"
                        alt="Selected variant"
                        width={24}
                        height={24}
                        className="w-8 h-8"
                        unoptimized={true}
                      />
                    </div>
                  )}
                  {/* Swatch Image */}
                  <div
                    data-testid={`variant-swatch-wrapper-${variant.id}`}
                    className="rounded-md overflow-hidden flex-shrink-0 mr-3 md:mr-4"
                  >
                    <Image
                      src={swatchImage || fallbackImageUrl}
                      alt={name || "Color swatch"}
                      width={75}
                      height={75}
                      className="object-cover w-[62px] h-[62px] md:w-[75px] md:h-[75px] border-[1.21px]"
                      style={{ borderRadius: "4px" }}
                    />
                  </div>
                  {/* Hardcoded Price (as per your requirement) */}
                  <div
                    data-testid={`variant-content-wrapper-${variant.id}`}
                    className="leading-none flex-1"
                  >
                    <div
                      data-testid={`variant-name-${variant.id}`}
                      className=" text-text-sm md:text-text-base font-normal"
                    >
                      {neContent}
                    </div>
                    <div
                      data-testid={`variant-price-section-${variant.id}`}
                      className="flex items-center gap-2 flex-nowrap text-left mr-3 md:mr-4"
                    >
                      <span className="text-text-base md:text-text-lg font-bold whitespace-nowrap">
                        ₹{priceInRupees}
                      </span>
                      {variantHasDiscount && (
                        <>
                          <span className="text-[14px] font-medium text-[#727272] line-through whitespace-nowrap">
                            {rupeeSymbol}
                            {comparedPriceInRupees}
                          </span>
                          <span className="text-[14px] font-medium text-[#D6322C] whitespace-nowrap">
                            {variantDiscountPercentage}
                            {discount}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Unit With Price */}
                    {variantUnitWithPrice && (
                      <Suspense
                        fallback={
                          <div
                            data-testid={`variant-unit-price-loading-${variant.id}`}
                            className="bg-[#F4F6F8] py-1 text-left text-text-sm md:text-text-base font-bold animate-pulse"
                          >
                            <span className="text-transparent">Loading...</span>
                          </div>
                        }
                      >
                        <div
                          data-testid={`variant-unit-price-${variant.id}`}
                          className="bg-[#F4F6F8] py-1 text-left text-text-sm md:text-text-base font-bold"
                        >
                          {variantUnitWithPrice}
                        </div>
                      </Suspense>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
