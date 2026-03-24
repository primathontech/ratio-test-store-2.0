"use client";

import { usePathname } from "next/navigation";
import { KwikCartCustom } from "./KwikCartCustom";

/**
 * Wrapper that forces KwikCartCustom to fully unmount and remount
 * on every navigation, so its scripts re-execute and re-attach
 * event listeners to the new DOM.
 */
export function KwikCartRemounter() {
  const pathname = usePathname();
  return <KwikCartCustom key={pathname} />;
}
