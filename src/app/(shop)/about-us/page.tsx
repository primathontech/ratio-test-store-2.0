import React from "react";
import { getStaticLocale } from "@shopkit/i18n/server";
import { TranslationProvider } from "@shopkit/i18n/client";
import type { Locale } from "@shopkit/i18n";
import { getRouteTranslations, getThemeName } from "@/utils";
import AboutUsTemplate from "@/editor-integration/static-templates/about-us";
import { getPageMetadata } from "@shopkit/seo";
import type { Metadata } from "next";

export default async function AboutUsPage() {
  const locale = getStaticLocale();
  const themeName = getThemeName();

  const translations = await getRouteTranslations({
    themeName,
    language: locale,
    staticTemplateId: "about-us",
  });

  return (
    <TranslationProvider locale={locale as Locale} translations={translations}>
      <AboutUsTemplate />
    </TranslationProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/about-us",
    fallback: { title: "About Us" },
  });
}
