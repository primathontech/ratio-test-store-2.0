"use client";

import React from "react";

interface CollectionSingleTab {
  id: string;
  label: string;
  handle: string;
}

interface CollectionTabsProps {
  collections: CollectionSingleTab[];
  activeTabId: string;
  isLoading?: boolean;
  onTabChange: (tabId: string) => void;
  sectionTextStyle?: React.CSSProperties;
  isBackgroundImage?: boolean;
}

export function CollectionTabs({
  collections,
  activeTabId,
  isLoading = false,
  onTabChange,
  sectionTextStyle,
  isBackgroundImage = false,
}: CollectionTabsProps) {
  // Don't render tabs if only one collection
  if (collections.length <= 1) {
    return null;
  }

  return (
    <div
      data-testid="collection-tabs-container"
      className="relative flex md:justify-center hide-scrollbar overflow-x-auto mb-[2.4rem] md:mb-[3.2rem]"
    >
      <div
        data-testid="collection-tabs-wrapper"
        className="flex gap-[0.8rem] md:gap-6"
      >
        {collections.map((collection) => (
          <button
            key={collection.id}
            data-testid={`collection-tab-${collection.id}`}
            onClick={() => onTabChange(collection.id)}
            disabled={isLoading}
            className={`first:ml-[1.6rem] last:mr-[1.6rem] text-text-sm md:text-text-lg px-[8px] py-[4px] md:px-[9px] md:py-[2px] font-normal rounded-[4px] !leading-none whitespace-nowrap ${
              activeTabId === collection.id
                ? isBackgroundImage
                  ? "border border-white/50"
                  : "border border-primary"
                : ""
            } ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
            style={sectionTextStyle}
          >
            {collection.label}
          </button>
        ))}
      </div>
    </div>
  );
}
