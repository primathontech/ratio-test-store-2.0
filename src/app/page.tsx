// app/page.tsx
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getMerchantName, getThemeName } from "@/utils";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "home",
    path: "/",
    fallback: {
      title: "The Moms Co. — Safe, Natural & Toxin-Free Baby Care Products",
      description:
        "Discover gentle, toxin-free baby care essentials at The Moms Co. From natural baby lotions and shampoos to diaper rash creams — everything your little one needs, made with love and safe ingredients.",
    },
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { editor?: string; previewKey?: string };
}) {
  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(
      Promise.resolve(searchParams ?? {})
    );

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
  // isEditor selects the editor (client-shim) widget manifest so live overrides
  // reach widgets; previewPageConfig is the editor's in-flight edit (undefined
  // on normal traffic → falls through to the regular template load).
  const pageBuilder = createPageBuildingEngine({ isEditor });
  // Clear @shopkit/builder's internal template cache so API changes are picked up on every request
  pageBuilder.clearCache();

  // Note: The builder uses "merchantName" internally for loading themes/templates
  // from @/themes/{name}/templates/, so we pass themeName here
  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
    pageConfig: previewPageConfig,
  });

  return <>{pageContent}</>;
}
