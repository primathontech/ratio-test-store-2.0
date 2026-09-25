import React from "react";
import { OurPromiseProps } from "./types";
import { OurPromiseVariants } from "./variants";

/**
 * OurPromise Widget
 *
 * Trust badges / brand promise section with center image
 * and four promise items arranged around it.
 */
export function OurPromise({
  data,
  settings,
  className,
  locale,
}: OurPromiseProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    OurPromiseVariants[variant as keyof typeof OurPromiseVariants];

  if (!VariantComponent) {
    console.warn(`OurPromise variant "${variant}" not found, using default`);
    const DefaultComponent = OurPromiseVariants.default;
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
