import React from "react";
import { Variants } from "./variants";
import { TProps, ISettings } from "./types";

export const defaultSettings: ISettings = {
  variant: "v1",
  autoLoadMore: true,
};

export function CollectionPage({
  data,
  settings = defaultSettings,
  className,
  locale,
}: TProps) {
  const variant = settings.variant || "v1";
  const VariantComponent = Variants[variant as keyof typeof Variants];

  if (!VariantComponent) {
    const DefaultComponent = Variants.default;
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
