import React from "react";
import { AboutUsProps } from "./types";
import { AboutUsVariants } from "./variants";

export function AboutUs({ data, settings, className, locale }: AboutUsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    AboutUsVariants[variant as keyof typeof AboutUsVariants];

  if (!VariantComponent) {
    console.warn(`AboutUs variant "${variant}" not found, using default`);
    const DefaultComponent = AboutUsVariants.default;
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
