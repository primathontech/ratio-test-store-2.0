"use client";

import React from "react";
import { SearchVariants } from "./variants";
import type { SearchProps } from "./types";

export type { SearchData, SearchSettings, SearchProps } from "./types";

export function Search({ data, settings, className, locale }: SearchProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    SearchVariants[variant as keyof typeof SearchVariants];

  if (!VariantComponent) {
    const DefaultComponent = SearchVariants.default;
    return (
      <DefaultComponent
        data={data}
        settings={settings}
        className={className}
        locale={locale}
      />
    );
  }

  return (
    <VariantComponent
      data={data}
      settings={settings}
      className={className}
      locale={locale}
    />
  );
}

export default Search;
