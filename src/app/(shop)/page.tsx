// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";

/** ISR — revalidate collection data every 3600 seconds */
export const revalidate = 3600;

// Generate metadata for home page. The `fallback` is merchant-agnostic: title
// and description come from the configured site name so a fork needs no edit.
export async function generateMetadata(): Promise<Metadata> {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Our Store";
  return getPageMetadata({
    pageType: "home",
    path: "/",
    fallback: {
      title: `${siteName} | Shop Online`,
      description:
        process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
        `Shop the latest products at ${siteName}. Discover our full range and enjoy a fast, secure checkout.`,
    },
  });
}

export default async function HomePage() {
  // Full ISR: no searchParams read (that would force dynamic rendering).
  // Shopper traffic renders the published template; editor previews run on the
  // /internal-preview route + the draft-mode pipeline, so this stays static.
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/",
    params: {},
    query: {},
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = getPageBuilder();

  // Note: The builder uses "merchantName" internally for loading themes/templates
  // from @/themes/{name}/templates/, so we pass themeName here
  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <>{pageContent}</>;
}
