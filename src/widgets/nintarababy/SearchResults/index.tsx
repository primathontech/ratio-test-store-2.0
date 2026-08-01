"use client";

import React from "react";
import { SearchResultsVariants } from "./variants";
import { SearchResultsProps } from "./types";

export function SearchResults({
  data,
  settings,
  className,
}: SearchResultsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    SearchResultsVariants[variant as keyof typeof SearchResultsVariants];

  if (!VariantComponent) {
    const DefaultComponent = SearchResultsVariants.default;
    return (
      <DefaultComponent data={data} settings={settings} className={className} />
    );
  }

  return (
    <VariantComponent data={data} settings={settings} className={className} />
  );
}
