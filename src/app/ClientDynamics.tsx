"use client";

import dynamic from "next/dynamic";

const KwikPassCustom = dynamic(
  () =>
    import("@/integrations/kwikpass-custom").then((mod) => ({
      default: mod.KwikPassCustom,
    })),
  { ssr: false }
);

const CustomCartDrawer = dynamic(
  () =>
    import("@/integrations/cart-drawer-custom").then((mod) => ({
      default: mod.CustomCartDrawer,
    })),
  { ssr: false }
);

const KwikCartRemounter = dynamic(
  () =>
    import("@/integrations/kwikcart-custom").then((mod) => ({
      default: mod.KwikCartRemounter,
    })),
  { ssr: false }
);

export function ClientDynamics({
  locale,
  hasKwikcartDisabled,
}: {
  locale: string;
  hasKwikcartDisabled: boolean;
}) {
  return (
    <>
      <KwikPassCustom />
      {hasKwikcartDisabled ? (
        <CustomCartDrawer locale={locale as "en"} />
      ) : (
        <KwikCartRemounter />
      )}
    </>
  );
}
