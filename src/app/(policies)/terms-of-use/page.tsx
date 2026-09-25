import React from "react";
import { getStaticLocale } from "@shopkit/i18n/server";
import { TranslationProvider } from "@shopkit/i18n/client";
import type { Locale } from "@shopkit/i18n";
import { getRouteTranslations, getThemeName } from "@/utils";
import TermsOfUseTemplate from "@/editor-integration/static-templates/terms-of-use";
import { getPageMetadata } from "@shopkit/seo";
import type { Metadata } from "next";

export default async function TermsOfUsePage() {
  const locale = getStaticLocale();
  const themeName = getThemeName();

  const translations = await getRouteTranslations({
    themeName,
    language: locale,
    staticTemplateId: "terms-of-use",
  });

  return (
    <TranslationProvider locale={locale as Locale} translations={translations}>
      <TermsOfUseTemplate />
    </TranslationProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/terms-of-use",
    fallback: {
      title: "Terms of Use",
      description:
        "Terms of Use for The MOMsco website operated by VLPCPL ECOMMERCE PVT LTD.",
    },
  });
}
