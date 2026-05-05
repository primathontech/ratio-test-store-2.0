import React from "react";
import { CollectionListProps } from "./types";
import { CollectionListVariants } from "./variants";

/**
 * CollectionList Widget
 *
 * Lists all collections in a paginated grid (page-based pagination via URL ?page=).
 * Data is provided via `DATA_SOURCE_TYPES.COLLECTIONS` (or any shape with
 * collections / edges / nodes).
 */
export function CollectionList({
  data,
  settings,
  className,
  locale,
}: CollectionListProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CollectionListVariants[variant as keyof typeof CollectionListVariants];

  if (!VariantComponent) {
    console.warn(
      `CollectionList variant "${variant}" not found, using default`
    );
    const DefaultComponent = CollectionListVariants.default;
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

export default CollectionList;
