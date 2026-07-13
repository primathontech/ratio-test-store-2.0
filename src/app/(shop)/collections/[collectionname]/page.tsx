import { createCollectionStaticParams } from "@shopkit/data-layer";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale, loadMessages } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { KwikPassCollectionView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;
export const dynamicParams = true;
export const generateStaticParams =
  createCollectionStaticParams(getCommerceClient);

export async function generateMetadata(props: {
  params: Promise<{ collectionname: string }>;
  searchParams?: Promise<Record<string, string>>;
}): Promise<Metadata> {
  try {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const collection = await fetchCollection(params.collectionname);
    return getPageMetadata({
      pageType: "collection",
      path: `/collections/${params.collectionname}`,
      data: collection,
      searchParams,
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
    const [messages, collection] = await Promise.all([
      loadMessages(locale as "en", "collections"),
      fetchCollection(params.collectionname),
    ]);

    if (!collection) {
      notFound();
    }

    const routeContext = {
      templateName: TEMPLATE_TYPES.collection,
      path: `/collections/${params.collectionname}`,
      params: { handle: params.collectionname },
      query: {},
    };

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
