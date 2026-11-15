/**
 * Product page (via a collection), rendered for one A/B arm.
 *
 * Reached only via a middleware rewrite. Calls the real page's body so the two
 * arms cannot drift apart.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  renderCollectionProduct,
  pageMetadata,
} from "../../../../../../_render/collection-product";
import { isArm, toArm } from "@/bootstrap/ab";

export const revalidate = 3600;

export const dynamicParams = true;

// Returns [] deliberately: prerenders nothing, so `next build` stays identical
// for merchants running no experiment — but WITHOUT it Next treats the route as
// fully dynamic and re-renders every arm request instead of ISR-caching it.
export async function generateStaticParams() {
  return [];
}

// Delegates to the SAME metadata the canonical route uses.
//
// Middleware rewrites both arms, and a rewrite renders THIS route — metadata is
// not inherited from the sibling page.tsx. A static `robots: noindex` here
// therefore lands on `/`, `/products/x` and `/collections/y` for real traffic
// the moment any experiment starts, stripping title, description, canonical and
// OG along with it. Arm URLs stay out of the index by being unlinked and absent
// from the sitemap, plus the X-Robots-Tag middleware sets on a direct hit.
export async function generateMetadata(props: {
  params: Promise<{ collectionname: string; handle: string; arm: string }>;
}): Promise<Metadata> {
  return pageMetadata(props);
}

export default async function VariantPage({
  params,
}: {
  params: Promise<{ collectionname: string; handle: string; arm: string }>;
}) {
  const p = await params;
  // Anything but a/b would render 200 and mint another ISR entry, so a
  // crawler walking guessed suffixes could grow the cache without bound.
  if (!isArm(p.arm)) {
    notFound();
  }
  return renderCollectionProduct(
    { collectionname: p.collectionname, handle: p.handle },
    toArm(p.arm)
  );
}
