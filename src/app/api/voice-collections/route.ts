/**
 * Voice collections — the retrieval source for the "browse a collection" flow.
 *
 * SINGLE SOURCE OF TRUTH: the agent must only ever open a collection the shopper can
 * actually SEE. The storefront's browsable collections are the ones wired into the
 * DISPLAYED navigation (the header mega-menu + footer), rendered via `useNav`. So this
 * route resolves collections from the SAME nav menus the chrome renders — NOT from
 * `getCommerceClient().getCollections()`, which returns the entire raw catalog
 * (including internal / duplicate / home-page-only collections like `*-copy` that
 * appear nowhere in the UI). Reading the raw catalog is exactly what let the agent open
 * `shampoo-haircarebffs-copy` for "the shampoo collection".
 *
 * WHICH menus to read is NOT hardcoded to "main-menu": each chrome widget's menu is an
 * editor-managed `settings.menuHandle`, so we read those handles straight from the
 * resolved header/footer template CONFIG (the edited templates when editor changes are
 * enabled — the same source the storefront renders from). If a merchant renames or
 * reassigns the menu in the editor, voice follows automatically with no code/env
 * change. We scan the config only (no chrome render / no data-source fetch — that would
 * be far too heavy for this route). An explicit env override is an escape hatch; a
 * hardcoded default is the last resort.
 *
 * We then walk each menu tree (top-level + dropdown items + mega-menu columns/leaves)
 * and keep every COLLECTION link, emitting its handle + displayed title. Deduped by
 * handle. If the menus are unavailable/empty (misconfig or nav backend down), we fall
 * back to the raw catalog so collection browse still works — degraded, never dead.
 *
 * Same-origin, guarded (origin + per-IP rate limit) like the other voice routes.
 */

import { getNavMenu, type NavItem } from "@shopkit/navigation";
import { getCommerceClient } from "@/config";
import { getThemeName } from "@/utils";
import { editorTemplateLoader } from "@/editor-integration/template-load-pipeline";
import { voiceGuard } from "@/lib/voiceGuard";

interface VoiceCollection {
  handle: string;
  title: string;
}

// Extract the collection handle a nav item points at, or null if it isn't a
// collection link. Handles both ways merchants author them:
//   1. a typed COLLECTION item — the handle is in `url` (bare, e.g. "shampoo") or an
//      absolute "/collections/shampoo" path;
//   2. ANY item (a hand-authored "link"/page entry) whose url/path is
//      "/collections/<handle>".
// External (HTTP) and broken links are skipped; PRODUCT/PAGE links that aren't under
// /collections are ignored.
function collectionHandleOf(item: NavItem): string | null {
  if (item.broken_link || item.resource_type === "HTTP") {
    return null;
  }
  const raw = (item.url || item.relative_path || "").trim();
  if (!raw) {
    return null;
  }
  if (item.resource_type === "COLLECTION") {
    const m = raw.match(/\/collections\/([^/?#]+)/);
    const handle = (m ? m[1] : raw).replace(/^\/+/, "").split(/[?#]/)[0].trim();
    return handle || null;
  }
  const m = raw.match(/^\/collections\/([^/?#]+)/);
  return m ? m[1].trim() : null;
}

// Depth-first walk collecting every COLLECTION entry (top-level, dropdown items,
// mega-menu columns + leaves) with its displayed title. First title wins per handle.
function collectCollections(items: NavItem[], out: Map<string, string>): void {
  for (const item of items || []) {
    const handle = collectionHandleOf(item);
    if (handle && !out.has(handle)) {
      out.set(handle, (item.title || handle).trim());
    }
    if (Array.isArray(item.items) && item.items.length) {
      collectCollections(item.items, out);
    }
  }
}

// Editor changes are DB-backed when this flag is on (mirrors the page builder's fork),
// so we load the EDITED chrome templates in that mode and the static theme templates
// otherwise — either way reflecting what the storefront actually renders.
const EDITOR_CHANGES_ENABLED =
  String(process.env.NEXT_PUBLIC_ENABLE_EDITOR_CHANGES).toLowerCase() ===
  "true";

// The chrome slots whose widgets carry menu handles.
const CHROME_TEMPLATES = ["header", "footer"];

// Minimal shape we read from a resolved template — just enough to find menu handles.
type LooseTemplate = {
  sections?: Array<{ widgets?: Array<{ settings?: Record<string, unknown> }> }>;
};

async function loadChromeTemplate(
  merchant: string,
  name: string
): Promise<LooseTemplate | null> {
  try {
    if (EDITOR_CHANGES_ENABLED) {
      return (await editorTemplateLoader.loadTemplate(
        merchant,
        name,
        "default"
      )) as LooseTemplate;
    }
    const mod = await import(`@/themes/${merchant}/templates/${name}/default`);
    return (mod?.template ?? null) as LooseTemplate | null;
  } catch {
    return null;
  }
}

// Collect every menu handle a chrome widget references — any setting whose key ends in
// "menuHandle" (the platform convention: `menuHandle`, `categoriesMenuHandle`, …) with
// a non-empty string value. This is the SAME derivation the page builder uses for
// chrome `menuHandles`, but read from the template CONFIG only — NO renderPage, NO
// header/footer data-source fetches (that render would fire every chrome data source
// with no timeout, on a latency-sensitive voice route).
function scanMenuHandles(tpl: LooseTemplate | null, out: Set<string>): void {
  for (const section of tpl?.sections ?? []) {
    for (const widget of section.widgets ?? []) {
      const settings = widget?.settings;
      if (!settings) {
        continue;
      }
      for (const [key, value] of Object.entries(settings)) {
        if (
          /menuhandle$/i.test(key) &&
          typeof value === "string" &&
          value.trim()
        ) {
          out.add(value.trim());
        }
      }
    }
  }
}

// The chrome menu handles, cached briefly (chrome config changes rarely; matches the
// nav Data-Cache 300s TTL) so we don't re-resolve templates on every lookup.
let menuHandleCache: { handles: string[]; at: number } | null = null;
const MENU_TTL_MS = 300_000;

async function resolveChromeMenuHandles(): Promise<string[]> {
  // Escape hatch: explicit ops override (comma-separated) wins when set.
  const override = (process.env.NEXT_PUBLIC_VOICE_COLLECTION_MENUS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (override.length) {
    return override;
  }

  const now = Date.now();
  if (menuHandleCache && now - menuHandleCache.at < MENU_TTL_MS) {
    return menuHandleCache.handles;
  }
  const merchant = getThemeName();
  const set = new Set<string>();
  const templates = await Promise.all(
    CHROME_TEMPLATES.map((name) => loadChromeTemplate(merchant, name))
  );
  for (const tpl of templates) {
    scanMenuHandles(tpl, set);
  }
  const handles = Array.from(set);
  if (handles.length) {
    menuHandleCache = { handles, at: now };
  }
  return handles;
}

// Legacy raw-catalog source — used ONLY as a last-resort fallback when the menus yield
// nothing, so a nav outage doesn't kill collection browse entirely.
async function rawCatalogCollections(): Promise<VoiceCollection[]> {
  const client = getCommerceClient();
  const result = await client.getCollections({ first: 100 });
  const raw: unknown = (result as { data?: unknown })?.data;
  const list = Array.isArray(raw)
    ? (raw as Array<Record<string, unknown>>)
    : [];
  return list
    .map((c) => {
      const handle = typeof c.handle === "string" ? c.handle : "";
      const title =
        (typeof c.title === "string" && c.title) ||
        (typeof c.name === "string" && (c.name as string)) ||
        handle;
      return { handle, title };
    })
    .filter((c) => c.handle.length > 0);
}

export async function GET(req: Request) {
  const blocked = voiceGuard(req, "read", 150);
  if (blocked) return blocked;
  try {
    let handles = await resolveChromeMenuHandles();
    // Last-resort default only if the chrome couldn't be resolved at all.
    if (!handles.length) {
      handles = ["main-menu"];
    }

    // Fetch the menu(s) in parallel; one bad/unknown handle must not fail the whole
    // list (getNavMenu already returns null on failure — guard anyway).
    const menus = await Promise.all(
      handles.map((h) => getNavMenu(h).catch(() => null))
    );
    const map = new Map<string, string>();
    for (const menu of menus) {
      if (menu?.items) {
        collectCollections(menu.items, map);
      }
    }
    let collections: VoiceCollection[] = Array.from(map, ([handle, title]) => ({
      handle,
      title,
    }));

    if (!collections.length) {
      collections = await rawCatalogCollections();
    }

    return Response.json({ collections });
  } catch {
    // Graceful: the tool falls back to keyword search when the list is empty. Return
    // an empty list only — never echo the upstream/exception message to the client.
    return Response.json({ collections: [] });
  }
}
