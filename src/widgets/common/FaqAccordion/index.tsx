import { FaqAccordionProps } from "./types";
import { FaqAccordionVariants } from "./variants";

const defaultSettings = {
  variant: "v1",
  title: "FAQ",
};

export function FaqAccordion({
  data,
  settings = defaultSettings,
  className,
  locale,
}: FaqAccordionProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    FaqAccordionVariants[variant as keyof typeof FaqAccordionVariants];

  if (!VariantComponent) {
    const DefaultComponent = FaqAccordionVariants.default;
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
