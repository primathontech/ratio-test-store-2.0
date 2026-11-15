/**
 * Product detail, reached through a collection.
 *
 * A product is reachable at TWO paths, and both must honour an experiment — or
 * a test works from search and silently does not from a collection.
 */
import type { Metadata } from "next";
import {
  renderCollectionProduct,
  pageMetadata,
  staticParams,
} from "../../../../_render/collection-product";

export const revalidate = 3600;
export const dynamicParams = true;
export const generateStaticParams = staticParams;

export async function generateMetadata(props: {
  params: Promise<{ collectionname: string; handle: string }>;
}): Promise<Metadata> {
  return pageMetadata(props);
}

export default async function CollectionProductPage(props: {
  params: Promise<{ collectionname: string; handle: string }>;
}) {
  return renderCollectionProduct(await props.params);
}
