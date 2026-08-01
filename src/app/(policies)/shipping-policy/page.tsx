import React from "react";
import { getStaticLocale } from "@shopkit/i18n/server";
import { TranslationProvider } from "@shopkit/i18n/client";
import type { Locale } from "@shopkit/i18n";
import { getRouteTranslations, getThemeName } from "@/utils";
import ShippingPolicyTemplate from "@/editor-integration/static-templates/shipping-policy";
import { getPageMetadata } from "@shopkit/seo";
import type { Metadata } from "next";

export default async function ShippingPolicyPage() {
  const locale = getStaticLocale();
  const themeName = getThemeName();

  const translations = await getRouteTranslations({
    themeName,
    language: locale,
    staticTemplateId: "shipping-policy",
  });

  return (
    <TranslationProvider locale={locale as Locale} translations={translations}>
      <ShippingPolicyTemplate />
    </TranslationProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/shipping-policy",
    fallback: {
      title: "Shipping & Delivery",
      description:
        "Learn about The MOMsco shipping and delivery policies, timelines, and charges.",
    },
  });
}
