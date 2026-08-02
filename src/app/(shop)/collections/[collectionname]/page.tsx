// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getResourceTemplateSuffix } from "@/utils/template-suffix";
import { getPageBuilder } from "@/bootstrap/builder";
import { KwikPassCollectionView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createCollectionStaticParams } from "@shopkit/data-layer";

// ISR: prerender every collection at build time, revalidate hourly, and still
// render (then cache) any handle not in the build set via on-demand ISR.
export const revalidate = 3600;
export const dynamicParams = true;

export const generateStaticParams =
  createCollectionStaticParams(getCommerceClient);

// Full ISR: `searchParams` is deliberately NOT read here. Reading it in
// generateMetadata opts the whole route out of static rendering just as surely
// as reading it in the page component would — this route was the only prerendered
// one in the app with no Revalidate window because of it.
//
// The cost: @shopkit/seo used that value to set `noIndex` on filtered views
// (its matcher is /^(sort_by|filter\.|page$)/), so those URLs no longer get a
// noindex from here. Serve it from middleware as an `X-Robots-Tag` header
// instead — the query string is visible there without touching staticness.
export async function generateMetadata(props: {
  params: Promise<{ collectionname: string }>;
}): Promise<Metadata> {
  try {
    const params = await props.params;
    const collection = await fetchCollection(params.collectionname);
    return getPageMetadata({
      pageType: "collection",
      path: `/collections/${params.collectionname}`,
      data: collection,
    });
  } catch {
    return {};
  }
}

export default async function CollectionPage(props: {
  params: Promise<{ collectionname: string }>;
}) {
  const params = await props.params;
  try {
    const themeName = getThemeName();
    const locale = getStaticLocale();
    const collection = await fetchCollection(params.collectionname);

    if (!collection) {
      notFound();
    }

    const routeContext = {
      templateName: TEMPLATE_TYPES.collection,
      path: `/collections/${params.collectionname}`,
      params: { handle: params.collectionname },
      query: {},
      // Page Templates: render the collection's assigned template; falls back to
      // default when unassigned or the template is missing.
      templateSuffix: getResourceTemplateSuffix(collection),
    };

    // Route translations: common + the resolved template's messages (consistent
    // with the home/product pages). Depends on routeContext, so it runs after the
    // collection is fetched.
    const messages = await getRouteTranslations({
      themeName,
      routeContext,
      language: locale,
    });

    // Get the page builder with widget manifest
    const pageBuilder = getPageBuilder();

    // Note: The builder uses "merchantName" internally for loading themes/templates
    // from @/themes/{name}/templates/, so we pass themeName here
    const pageContent = await pageBuilder.renderPage({
      merchantName: themeName,
      routeContext,
      locale,
      messages,
    });

    return (
      // Reserve viewport height while the collection content streams in. The
      // footer is rendered by the (shop) <Chrome> layout OUTSIDE this boundary,
      // so with an empty fallback the content slot collapses during streaming
      // and the footer flashes up under the header. A min-h-screen placeholder
      // keeps the footer below the fold until the content arrives. This is
      // SSR-streaming-only — it's replaced by the real content the moment it
      // resolves, so the final rendered UI is unchanged.
      <Suspense fallback={<div className="min-h-screen" aria-hidden />}>
        {pageContent}
        <KwikPassCollectionView collection={collection} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error rendering collection page:", error);
    notFound();
  }
}

/**
 * Fetch collection data using the commerce client
 */
async function fetchCollection(handle: string): Promise<any | null> {
  try {
    const commerceClient = getCommerceClient();

    const collection = await commerceClient.getCollection({
      handle,
    });

    return collection.data;
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return null;
  }
}
