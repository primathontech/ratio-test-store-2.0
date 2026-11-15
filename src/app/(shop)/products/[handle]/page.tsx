/**
 * Product detail.
 *
 * Body in `(shop)/_render/product.tsx` — Next allows only its own reserved
 * exports on a route file, and the `/variant/[arm]` mirror calls the same body
 * with an arm.
 */
import type { Metadata } from "next";
import {
  renderProduct,
  pageMetadata,
  staticParams,
} from "../../_render/product";

export const revalidate = 3600;
export const dynamicParams = true;
export const generateStaticParams = staticParams;

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  return pageMetadata(props);
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  return renderProduct(await props.params);
}
