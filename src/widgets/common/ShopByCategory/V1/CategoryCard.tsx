"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IShopByCategoryItem } from "../types";

interface CategoryCardProps {
  category: IShopByCategoryItem;
  showNames: boolean;
  index?: number;
}

// Gradient backgrounds for category cards
const CATEGORY_GRADIENTS = [
  "linear-gradient(98.28deg, #551242 0.61%, #000000 100%)",
  "linear-gradient(98.28deg, #2B146B 0.61%, #000000 100%)",
  "linear-gradient(98.28deg, #541E0E 0.61%, #000000 100%)",
  "linear-gradient(98.28deg, #2B146B 0.61%, #000000 100%)",
  "linear-gradient(98.28deg, #454545 0.61%, #000000 100%)",
  "linear-gradient(98.28deg, #454545 0.61%, #000000 100%)",
];

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  showNames,
  index = 0,
}) => {
  // Get gradient based on index with cycling
  const getGradient = (idx: number): string => {
    return CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length];
  };

  return (
    <Link
      key={category.id}
      href={category.href}
      target={category.target || "_self"}
      data-testid={`shop-by-category-card-${category.id}`}
      className="flex-shrink-0 group block md:max-h-[118px]"
    >
      {/* Category Container with Gradient Background */}
      <div
        data-testid={`shop-by-category-card-container-${category.id}`}
        className="relative flex gap-5 rounded-2xl transition-all duration-300 md:py-[29px] md:pr-8 md:pl-[74px]"
        style={{ background: getGradient(index) }}
      >
        {/* Product Image - Positioned in upper portion */}
        <div
          data-testid={`shop-by-category-card-image-container-${category.id}`}
          className="absolute z-10 bottom-[13px] left-[13px] aspect-[1/2] w-[50px]"
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

        {/* Category Name - Positioned at bottom */}
        {showNames && (
          <div
            data-testid={`shop-by-category-card-name-container-${category.id}`}
            className="text-right"
          >
            <h3
              data-testid={`shop-by-category-card-name-${category.id}`}
              className="font-bold text-sm md:text-[20px] xl:text-[24px] text-white leading-tight"
            >
              {category.name}
            </h3>
          </div>
        )}
      </div>
    </Link>
  );
};
