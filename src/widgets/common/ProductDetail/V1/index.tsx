"use client";

import React, { memo } from "react";

import {
  ProductDetailProps,
  ProductImage,
  ApiProduct,
  ProductMetadataKey,
} from "../types";
import { ProductGallery } from "../components/ProductGallery";
import { BbluntProductInfo } from "../components/BbluntProductInfo";
import { getProductLabel } from "@/utils/metafield";

/* ------------------------------------------------------------------ */
/*  API → Widget data transformers                                     */
/* ------------------------------------------------------------------ */

function transformApiImages(product: ApiProduct): ProductImage[] {
  return product.images.map((img) => ({
    url: img.url,
    altText: img.alt_text || product.title,
    id: img.id,
    type: img.media_type,
    thumbnail_url: img.thumbnail_url ?? undefined,
  }));
}

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: ProductDetailProps) {
  const product = data?.success ? data.data : null;

  // No product available — bail rather than render a broken section.
  if (!product) {
    return null;
  }

  const images: ProductImage[] = transformApiImages(product);

  // Two-source ribbon — metafield wins (green pill), else tag fallback
  // (resolved against `PRODUCT_TAG_LABELS_ARRAY`, e.g. "new-launch" → pink).
  const productLabelsMeta =
    product.metadata?.[ProductMetadataKey.PRODUCT_LABELS]?.value;
  const productLabel =
    getProductLabel(
      productLabelsMeta,
      product.tags?.map((tag) => tag.name)
    ) ?? null;

  // Optional template-driven copy overrides — passed through to
  // BbluntProductInfo. Each prop defaults to a bblunt-tuned string inside
  // the component, so anything left undefined falls through to that default.
  const infoProps = {
    addToCartText: settings?.addToCartText,
    netContentText: settings?.netContentText ?? settings?.netContentLabel,
    inclusiveOfAllTaxesText:
      settings?.inclusiveOfAllTaxesText ?? settings?.taxInfo,
    selectSizeText: settings?.selectSizeText ?? settings?.variantLabel,
    reviewsText: settings?.reviewsText,
    mrp: settings?.mrp,
    discount: settings?.discount,
    usp: settings?.usp,
    rupeeSymbol: settings?.rupeeSymbol,
    soldOutText: settings?.soldOutText,
    showProductMarquee: settings?.showProductMarquee,
    productMarqueeText: settings?.productMarqueeText,
    productMarqueeCouponCode: settings?.productMarqueeCouponCode,
    productMarqueeSpeed: settings?.productMarqueeSpeed,
    productMarqueeHref: settings?.productMarqueeHref,
  };

  return (
    <section
      className={`w-full bg-[#ffffff] ${className ?? ""}`}
      style={{ fontFamily: "Gotham, sans-serif" }}
    >
      <div className="pt-0 pb-0 lg:pt-[47px] xl:pt-[56px] lg:pb-[27px] xl:pb-[32px]">
        <div className="px-[16px] md:px-[30px] xl:px-[77px] pt-[16px] md:pt-0">
          {/* Mobile — info stacks above gallery (gallery slot is rendered
              inside BbluntProductInfo via `renderGallery`). */}
          <div className="block md:hidden">
            <BbluntProductInfo
              data={product}
              renderGallery={
                <ProductGallery images={images} productLabel={productLabel} />
              }
              {...infoProps}
            />
          </div>

          {/* Desktop — two-column layout. */}
          <div className="hidden md:flex gap-[16px] pt-0 pb-0 md:pt-[47px] lg:pt-0 md:pb-[27px] lg:pb-0">
            <div className="flex-1 min-w-0">
              <div className="sticky top-[30px]">
                <ProductGallery images={images} productLabel={productLabel} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="sticky top-[30px] pl-0 xl:pl-[13px]">
                <BbluntProductInfo data={product} {...infoProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
