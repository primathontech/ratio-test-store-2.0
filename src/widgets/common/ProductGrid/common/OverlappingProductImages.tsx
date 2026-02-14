import React from "react";
import Image from "next/image";

interface OverlappingProductImagesProps {
  products: any[];
  className?: string;
}

export const OverlappingProductImages: React.FC<
  OverlappingProductImagesProps
> = ({ products, className = "" }) => {
  // Get first three products
  const firstThreeProducts = products.slice(0, 3);

  if (firstThreeProducts.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="overlapping-product-images-container"
      className={`flex items-center ${className}`}
    >
      {firstThreeProducts.map((product, index) => {
        const imageUrl =
          product?.images?.[0]?.url || product?.featuredImage?.url;
        const altText =
          product?.images?.[0]?.altText || product?.title || "Product image";

        if (!imageUrl) {
          return null;
        }

        return (
          <div
            key={product.id || product.handle || index}
            data-testid={`overlapping-product-images-item-${index}`}
            className="relative size-8 rounded-[4px] overflow-hidden border border-[#DDDDDD]"
            style={{
              marginLeft: index > 0 ? "-10px" : "0",
              zIndex: index,
            }}
          >
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-cover"
              sizes="20px"
            />
          </div>
        );
      })}
    </div>
  );
};
