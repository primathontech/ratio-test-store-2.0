/**
 * Home.
 *
 * The body lives in `(shop)/_render/home.tsx` because Next allows only its own
 * reserved exports on a route file, and the `/variant/[arm]` mirror needs to
 * call the same body with an arm. `_render` is a private folder — the leading
 * underscore keeps it out of the router.
 */
import type { Metadata } from "next";
import { renderHome, pageMetadata } from "./_render/home";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata();
}

export default async function HomePage() {
  return renderHome();
}
