/**
 * Collection listing.
 *
 * Body in `(shop)/_render/collection.tsx` — Next allows only its own reserved
 * exports on a route file, and the `/variant/[arm]` mirror calls the same body
 * with an arm.
 */
import type { Metadata } from "next";
import {
  renderCollection,
  pageMetadata,
  staticParams,
} from "../../_render/collection";

export const revalidate = 3600;
export const dynamicParams = true;
export const generateStaticParams = staticParams;

export async function generateMetadata(props: {
  params: Promise<{ collectionname: string }>;
}): Promise<Metadata> {
  return pageMetadata(props);
}

export default async function CollectionPage(props: {
  params: Promise<{ collectionname: string }>;
}) {
  return renderCollection(await props.params);
}
