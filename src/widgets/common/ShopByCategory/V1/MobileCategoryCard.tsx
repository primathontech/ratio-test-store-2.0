"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IShopByCategoryItem } from "../types";

interface MobileCategoryCardProps {
  category: IShopByCategoryItem;
  showNames: boolean;
  index?: number;
}

// Border gradients for mobile category cards
const BORDER_GRADIENTS = [
  "linear-gradient(180deg, #A7418A 0%, #000000 100%)",
  "linear-gradient(180deg, #6D46D1 0%, #000000 100%)",
  "linear-gradient(180deg, #E86137 0%, #000000 100%)",
  "linear-gradient(180deg, #D4A73C 0%, #000000 100%)",
  "linear-gradient(180deg, #6D46D1 0%, #000000 100%)",
  "linear-gradient(180deg, #AEAEAE 0%, #000000 100%)",
];

// Mobile background gradients for category cards
const MOBILE_GRADIENTS = [
  "linear-gradient(180deg, #50123F 0%, #000000 100%)",
  "linear-gradient(180deg, #210770 0%, #000000 100%)",
  "linear-gradient(180deg, #B33B1B 0%, #000000 100%)",
  "linear-gradient(180deg, #986519 0%, #000000 100%)",
  "linear-gradient(180deg, #210770 0%, #000000 100%)",
  "linear-gradient(98.28deg, #454545 0.61%, #000000 100%)",
];

export const MobileCategoryCard: React.FC<MobileCategoryCardProps> = ({
  category,
  showNames,
  index = 0,
}) => {
  // Create hexagon clip path
  const hexagonClipPath =
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  // Get gradients based on index with cycling
  const getGradients = (idx: number) => {
    const gradientIndex = idx % BORDER_GRADIENTS.length;
    return {
      border: BORDER_GRADIENTS[gradientIndex],
      background: MOBILE_GRADIENTS[gradientIndex],
    };
  };

  const gradients = getGradients(index);

  return (
    <div
      data-testid={`shop-by-category-mobile-card-${category.id}`}
      className="relative flex flex-col items-center pt-[30px]"
    >
      <Link
        href={category.href}
        target={category.target || "_self"}
        data-testid={`shop-by-category-mobile-card-link-${category.id}`}
        className="relative block"
      >
        {/* Product Image */}
        <div
          data-testid={`shop-by-category-mobile-card-image-container-${category.id}`}
          className="absolute left-1/2 bottom-[15px] z-10 -translate-x-1/2 w-[40px] h-[85px]"
        >
          <Image
            src={category.image}
            alt={category.alt || category.name}
            fill
            className="object-contain drop-shadow-lg"
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        {/* Hexagon Border Container */}
        <div
          data-testid={`shop-by-category-mobile-card-hexagon-border-${category.id}`}
          className="relative w-[66px] h-[76px] p-[2px]"
          style={{
            clipPath: hexagonClipPath,
            background: gradients.border,
          }}
        >
          {/* Inner Hexagon with Product Image */}
          <div
            data-testid={`shop-by-category-mobile-card-hexagon-inner-${category.id}`}
            className="w-full h-full relative flex items-center justify-center"
            style={{
              clipPath: hexagonClipPath,
              background: gradients.background,
            }}
          ></div>
        </div>
      </Link>

      {/* Category Name */}
      {showNames && (
        <div
          data-testid={`shop-by-category-mobile-card-name-container-${category.id}`}
          className="mt-1 text-center"
        >
          <h3
            data-testid={`shop-by-category-mobile-card-name-${category.id}`}
            className="font-medium text-[11px] text-black"
          >
            {category.name}
          </h3>
        </div>
      )}
    </div>
  );
};
