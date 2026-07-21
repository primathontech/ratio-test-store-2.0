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
  const hasImage = imageSrc !== PLACEHOLDER_IMAGE;
  const title = collection.title || collection.handle || "Collection";
  const initial = title.trim().charAt(0).toUpperCase() || "•";

  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      data-testid={`collection-card-${collection.handle}`}
      aria-label={title}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/[0.06] shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:ring-black/10">
        {hasImage ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            loading={index < 4 ? "eager" : "lazy"}
          />
        ) : (
          // Graceful fallback for collections with no image: a soft branded
          // gradient with the collection's monogram, so the grid never shows a
          // bare gray box.
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 via-neutral-100 to-neutral-200">
            <span className="select-none text-6xl md:text-7xl font-semibold text-neutral-300 transition-transform duration-500 ease-out group-hover:scale-110">
              {initial}
            </span>
          </div>
        )}

        {/* Legibility scrim so the title reads on any image. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Title + hover CTA affordance. */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 md:p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow-sm md:text-base lg:text-[17px]">
            {title}
          </h3>
          <span className="grid h-7 w-7 shrink-0 translate-y-1 place-items-center rounded-full bg-white/95 text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:h-8 md:w-8">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};
