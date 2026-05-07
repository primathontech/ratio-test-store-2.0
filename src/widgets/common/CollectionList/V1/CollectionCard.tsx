"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ICollectionListItem } from "../types";

interface CollectionCardProps {
  collection: ICollectionListItem;
  index: number;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=";

function resolveImage(collection: ICollectionListItem): string {
  if (collection.image_url) {
    return collection.image_url;
  }
  if (collection.image?.url) {
    return collection.image.url;
  }
  if (collection.image?.src) {
    return collection.image.src;
  }

  const products = collection.products ?? [];
  for (const product of products) {
    const mainImg = product.images?.find((img) => img.is_main);
    if (mainImg?.url) {
      return mainImg.url;
    }
    if (product.images?.[0]?.url) {
      return product.images[0].url;
    }
    if (product.image_url) {
      return product.image_url;
    }
  }

  return PLACEHOLDER_IMAGE;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  index,
}) => {
  const imageSrc = resolveImage(collection);

  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group block relative rounded-2xl overflow-hidden"
      data-testid={`collection-card-${collection.handle}`}
    >
      <div>
        <Image
          src={imageSrc}
          alt={collection.title}
          width={422}
          height={422}
          className="object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
          loading={index < 4 ? "eager" : "lazy"}
          unoptimized={imageSrc === PLACEHOLDER_IMAGE}
        />
      </div>

      <div className="bg-secondary rounded-[10px] text-center shadow-sm absolute bottom-[15px] md:bottom-[30px] left-2.5 right-2.5 z-10 max-w-[calc(100%-20px)] w-fit mx-auto py-2.5 lg:py-3">
        <h3 className="text-base md:text-lg font-medium text-black truncate leading-tight px-[14px] md:px-5">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
};
