"use client";
import React, { useEffect, useState } from "react";
import { ProductGallery } from "../../../common/ProductGallery";
import { BbluntProductInfo } from "../components/BbluntProductInfo";
import { ProductStickyBar } from "../components/ProductStickyBar";
import { ProductGalleryWithInfoProps } from "../types";
import { getProductAverageRating } from "../../ReviewSection/get-review-api";
import { useResponsive } from "@/hooks/useResponsive";
import { getProductLabel } from "../../ProductGrid/utils/metafield";

export function ProductGalleryWithInfoV1({
  data,
  settings,
  className = "",
  locale,
}: ProductGalleryWithInfoProps) {
  const [reviews, setReviews] = useState<{
    total: number | null;
    average: number | null;
  }>({
    total: null,
    average: null,
  });
  const [isHoverPreviewVisible, setIsHoverPreviewVisible] = useState(false);
  const {
    responsive = {
      mobile: {
        stackVertically: true,
      },
    },
    productGallery = {},
    addToCartText,
    netContentText,
    inclusiveOfAllTaxesText,
    reviewsText,
    mrp,
    discount,
    usp,
    rupeeSymbol,
    selectSizeText,
    soldOutText,
  } = settings;

  const product = data?.data;
  const { isMobile } = useResponsive();
  enum PRODUCT_INFO_METAFIELD_KEYS {
    PRODUCT_LABEL = "product_labels",
  }

  const productLabelsMeta =
    product?.metadata?.[PRODUCT_INFO_METAFIELD_KEYS.PRODUCT_LABEL]?.value;

  const productLabel = getProductLabel(
    productLabelsMeta,
    product?.tags?.map((tag: any) => tag.name),
  );
  useEffect(() => {
    const fetchReviewCount = async () => {
      const productID = product?.id;
      if (!productID) return;

      try {
        const ratingData = await getProductAverageRating(productID);

        if (ratingData) {
          setReviews({
            total: ratingData.total_ratings ?? null,
            average: ratingData.average_rating ?? null,
          });
        }
      } catch (error) {
        console.error("Error fetching review count:", error);
      }
    };

    fetchReviewCount();
  }, [product?.id]);

  // Prepare data for ProductGallery
  const galleryData = {
    images: product?.images || [],
  };

  // Determine flex direction based on mobile settings
  const mobileFlexDirection = responsive.mobile?.stackVertically
    ? "flex-col"
    : "flex-row";

  return (
    <>
      <div
        data-testid="product-gallery-with-info-container"
        className={`max-w-[1200px] mx-auto px-6 flex w-full ${mobileFlexDirection} md:flex-row gap-6 md:gap-14 md:pt-[20px] ${className}`}
      >
        {/* Product Gallery Section (desktop/tablet visible) */}
        <div
          data-testid="product-gallery-section-desktop"
          className="hidden md:block w-full md:w-[calc(50%-15px)] xl:w-[660px] flex-shrink-0"
        >
          <ProductGallery
            data={galleryData}
            productLabel={productLabel}
            settings={{
              variant: "v1",
              images: galleryData.images,
              ...productGallery,
            }}
            locale={locale}
            onHoverPreviewChange={setIsHoverPreviewVisible}
          />
        </div>

        {/* Product Info Section (passes gallery for mobile order) */}
        <div
          data-testid="product-info-section"
          className={`
            w-full md:w-[45%] lg:w-1/2 flex-1
            ${isHoverPreviewVisible ? "md:opacity-20" : "md:opacity-100"}
            ${
              !isMobile
                ? "md:sticky md:top-[60px] md:self-start md:max-h-[calc(100vh-150px)] md:overflow-y-auto [.zoom-modal-open_&]:hidden transition-all duration-300"
                : ""
            }
          `}
        >
          <BbluntProductInfo
            data={product}
            addToCartText={addToCartText}
            inclusiveOfAllTaxesText={inclusiveOfAllTaxesText}
            netContentText={netContentText}
            reviewsText={reviewsText}
            mrp={mrp}
            usp={usp}
            discount={discount}
            rupeeSymbol={rupeeSymbol}
            selectSizeText={selectSizeText}
            soldOutText={soldOutText}
            reviews={reviews}
            renderGallery={
              <div
                data-testid="product-gallery-mobile-wrapper"
                className="-mx-6 md:mx-0"
              >
                <ProductGallery
                  data={galleryData}
                  productLabel={productLabel}
                  settings={{
                    variant: "v1",
                    images: galleryData.images,
                    ...productGallery,
                  }}
                  locale={locale}
                  onHoverPreviewChange={setIsHoverPreviewVisible}
                />
              </div>
            }
          />
        </div>
      </div>

      {/* Product Sticky Bar */}
      <div
        data-testid="product-sticky-bar-wrapper"
        className="[.zoom-modal-open_&]:hidden"
      >
        <ProductStickyBar
          data={product}
          addToCartText={addToCartText}
          inclusiveOfAllTaxesText={inclusiveOfAllTaxesText}
          mrp={mrp}
          discount={discount}
          rupeeSymbol={rupeeSymbol}
          soldOutText={soldOutText}
        />
      </div>
    </>
  );
}
