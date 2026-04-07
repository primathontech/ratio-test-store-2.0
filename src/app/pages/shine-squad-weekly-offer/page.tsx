import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shine Squad Weekly Offer - BBlunt",
    description:
      "Hair Fall Control Freebies! Shop for Rs.499 and get 2 best sellers FREE. Use code FREEHF.",
  };
}

export default async function ShineSquadWeeklyOfferPage() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["shine-squad-weekly-offer"],
    path: "/pages/shine-squad-weekly-offer",
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
