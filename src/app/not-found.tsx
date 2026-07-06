// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Chrome } from "@/components/Chrome";

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

  // Wrap in <Chrome> so the 404 shows the shared header/footer — same composition
  // the (shop) route group uses. This root not-found is the boundary for BOTH
  // unmatched URLs and notFound() raised inside shop pages, so both get chrome.
  return <Chrome>{pageContent}</Chrome>;
}
