/**
 * Home, rendered for one A/B arm.
 *
 * Reached only via a middleware rewrite. Calls the real page's body so the two
 * arms cannot drift apart.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderHome, pageMetadata } from "../../_render/home";
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
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata();
}

export default async function HomeVariantPage({
  params,
}: {
  params: Promise<{ arm: string }>;
}) {
  const { arm } = await params;
  // Anything but a/b would render 200 and mint another ISR entry, so a
  // crawler walking guessed suffixes could grow the cache without bound.
  if (!isArm(arm)) {
    notFound();
  }
  return renderHome(toArm(arm));
}
