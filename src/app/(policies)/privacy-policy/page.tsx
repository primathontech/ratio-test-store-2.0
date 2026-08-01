import React from "react";
import { getStaticLocale } from "@shopkit/i18n/server";
import { TranslationProvider } from "@shopkit/i18n/client";
import type { Locale } from "@shopkit/i18n";
import { getRouteTranslations, getThemeName } from "@/utils";
import PrivacyPolicyTemplate from "@/editor-integration/static-templates/privacy-policy";
import { getPageMetadata } from "@shopkit/seo";
import type { Metadata } from "next";

export default async function PrivacyPolicyPage() {
  const locale = getStaticLocale();
  const themeName = getThemeName();

  const translations = await getRouteTranslations({
    themeName,
    language: locale,
    staticTemplateId: "privacy-policy",
  });

  return (
    <TranslationProvider locale={locale as Locale} translations={translations}>
      <PrivacyPolicyTemplate />
    </TranslationProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/privacy-policy",
    fallback: {
      title: "Privacy Policy",
      description:
        "This Privacy Policy describes the policies and procedures of Visage Lines Personal Care Pvt Ltd on the collection, use and disclosure of your information.",
    },
  });
}
