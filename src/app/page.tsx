// app/page.tsx
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getSEOConfig } from "@/config";
import { MetaTagGenerator } from "@shopkit/seo";
import { getMerchantName, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";

// Generate metadata for home page
export async function generateMetadata(): Promise<Metadata> {
  const seoData = {
    title: "Best Bodybuilding & Gym Supplements Online - Wellversed",
    description:
      "Shop top quality bodybuilding and gym supplements online in India at Wellversed. Get the best prices on proteins, vitamins, and more crafted for your fitness goals!",
    type: "website" as "website",
    canonical: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://wellversed.in/"
    }`,
    image: {
      id: "wellversed-logo",
      url: "https://wellversed.in/cdn/shop/files/Wellversed_Logo_for_Website_Header_resized_979x200_79bb32c0-d7c8-4005-9aac-f10329d5ff31_1204x630.webp?v=1712297872",
      altText: "Wellversed Logo",
      width: 1200,
      height: 630,
    },
  };

  const seoConfig = getSEOConfig();
  const metaTagGenerator = new MetaTagGenerator(seoConfig);
  return metaTagGenerator.generateNextJSMetadata(seoData);
}

export default async function HomePage() {
  const merchantName = getMerchantName();
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/",
    params: {},
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  // Get the page builder (widgets auto-loaded)
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
