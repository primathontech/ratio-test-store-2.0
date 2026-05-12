// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";
import { resolvePageSEO } from "@shopkit/seo";
import { getSEOConfig } from "@/config";

export function generateMetadata(): Metadata {
  const { siteUrl, siteName } = getSEOConfig();
  return resolvePageSEO(
    {
      title: "Privacy Policy – BBlunt",
      description:
        'OBJECTIVE, SCOPE AND APPLICABILITY Honasa Consumer Limited Ltd. ("Company", "we", "our", "us") respects an individual\'s privacy and is committed to protecting the same. This Privacy Policy ("Policy") describes how we collect, use, disclose and transfer Personal Information (as defined below), through platforms controll',
    },
    { siteUrl, siteName, path: "/pages/privacy-policy" }
  );
}

export default async function PrivacyPolicyPage() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["privacy-policy"],
    path: "/pages/privacy-policy",
    params: {},
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = getPageBuilder();

  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <>{pageContent}</>;
}
