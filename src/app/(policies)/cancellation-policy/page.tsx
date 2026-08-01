import React from "react";
import { getStaticLocale } from "@shopkit/i18n/server";
import { TranslationProvider } from "@shopkit/i18n/client";
import type { Locale } from "@shopkit/i18n";
import { getRouteTranslations, getThemeName } from "@/utils";
import CancellationPolicyTemplate from "@/editor-integration/static-templates/cancellation-policy";
import { getPageMetadata } from "@shopkit/seo";
import type { Metadata } from "next";

export default async function CancellationPolicyPage() {
  const locale = getStaticLocale();
  const themeName = getThemeName();

  const translations = await getRouteTranslations({
    themeName,
    language: locale,
    staticTemplateId: "cancellation-policy",
  });

  return (
    <TranslationProvider locale={locale as Locale} translations={translations}>
      <CancellationPolicyTemplate />
    </TranslationProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/cancellation-policy",
    fallback: {
      title: "Cancellation, Return & Replacement Policy",
      description:
        "Learn about The MOMsco cancellation, return and replacement policies.",
    },
  });
}
