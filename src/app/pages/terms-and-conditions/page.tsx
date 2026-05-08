// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms & Conditions – BBlunt",
    description:
      "THIS DOCUMENT IS AN ELECTRONIC RECORD IN TERMS OF INFORMATION TECHNOLOGY ACT, 2000 (“IT ACT”) AND RULES ISSUED THEREUNDER, AS APPLICABLE AND THE PROVISIONS PERTAINING TO ELECTRONIC RECORDS IN VARIOUS STATUTES AS AMENDED BY THE IT ACT AND IS PUBLISHED IN ACCORDANCE WITH THE PROVISIONS OF APPLICABLE LAWS, INCLUDING THE",
  };
}

export default async function TermsAndConditionsPage() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["terms-and-conditions"],
    path: "/pages/terms-and-conditions",
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
