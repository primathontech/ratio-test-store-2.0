// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { getTranslations } from "@/utils/translations";
import { getPageBuilder } from "@/bootstrap/builder";

export default async function NotFound() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["not-found"],
    path: "/404",
    params: {},
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getTranslations({
    themeId: themeName,
    templateId: "common",
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
