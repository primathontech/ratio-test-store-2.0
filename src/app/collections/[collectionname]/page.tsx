import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getResourceTemplateSuffix } from "@/utils/template-suffix";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { KwikPassCollectionView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateStaticParams() {
  const featuredCollections = process.env.FEATURED_COLLECTIONS;

  // Check environment variable
  if (!featuredCollections) {
    console.error("FEATURED_COLLECTIONS environment variable not found");
    return [];
  }

  // Split and clean handles
  const handles = featuredCollections
    .split(",")
    .filter(Boolean)
    .map((h) => h.trim());

  // Return each handle as { collectionname }
  const staticParams = handles.map((handle) => ({
    collectionname: handle,
  }));

  return staticParams;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { collectionname: string };
  searchParams?: Record<string, string>;
}): Promise<Metadata> {
  const collection = await fetchCollection(params.collectionname);
  return getPageMetadata({
    pageType: "collection",
    path: `/collections/${params.collectionname}`,
    data: collection,
    searchParams,
  });
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { collectionname: string };
  searchParams?: { editor?: string; previewKey?: string };
}) {
  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(
      Promise.resolve(searchParams ?? {})
    );

  const themeName = getThemeName();
  const locale = getStaticLocale();

  // Fetch collection data - null if fails (widgets use default data)
  const collection = await fetchCollection(params.collectionname);

  const routeContext = {
    templateName: TEMPLATE_TYPES.collection,
    path: `/collections/${params.collectionname}`,
    params: { handle: params.collectionname },
    query: {},
    fetchAPITemplate: true,
    // Page Templates: render the collection's assigned template; falls back to
    // default when unassigned or the template is missing.
    templateSuffix: getResourceTemplateSuffix(collection),
  };

  // Load messages gracefully - empty object if fails
  let messages: Record<string, any> = {};
  try {
    messages = await getRouteTranslations({
      themeName,
      routeContext,
      language: locale,
    });
  } catch (e) {
    console.error("Failed to load collection messages:", e);
  }

  try {
    const pageBuilder = createPageBuildingEngine({ isEditor });
    // Clear @shopkit/builder's internal template cache so API changes are picked up on every request
    pageBuilder.clearCache();
    const pageContent = await pageBuilder.renderPage({
      merchantName: themeName,
      routeContext,
      locale,
      messages,
      pageConfig: previewPageConfig,
    });

    return (
      <Suspense fallback={<></>}>
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
