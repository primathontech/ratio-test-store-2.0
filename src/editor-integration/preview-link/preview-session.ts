/**
 * Request-scoped state for the merchant's shareable-preview session.
 *
 * Draft mode is the session: `/api/editor-preview/enter` turns it on and stores
 * the previewId in a cookie. Routes that funnel through `editorTemplateLoader`
 * get this resolution for free; a route that hands `renderPage` an explicit
 * pageConfig (custom pages) bypasses that loader and has to ask here.
 *
 * Kept out of the route file on purpose: `.eslintrc.json` bars `next/headers`
 * from page files, and the dynamic reads belong with the rest of the preview
 * lane rather than in a page.
 */
import type { PageConfig } from "@shopkit/builder";
import { cookies, draftMode } from "next/headers";
import { PREVIEW_ID_COOKIE, PREVIEW_VERSION_COOKIE } from "./cookies";
import { getResolvedPreview } from "./fetch-preview";

/**
 * True inside a preview session.
 *
 * Split from `getPreviewConfig` so callers keep the loader's guard: `cookies()`
 * forces dynamic rendering, `draftMode()` does not, so the cookie read stays
 * behind this check and normal traffic never reaches it.
 */
export async function isPreviewSession(): Promise<boolean> {
  const { isEnabled } = await draftMode();
  return isEnabled;
}

/**
 * The session's snapshot for one template, or null.
 *
 * A custom page passes its uuid: the editor keys page snapshots by it exactly
 * as it keys template snapshots by templateId, and the previews store has no
 * opinion about the shape. Null on any failure — a preview that can't load must
 * fall back to saved content, never blank the page.
 */
export async function getPreviewConfig(
  themeName: string,
  templateId: string
): Promise<PageConfig | null> {
  const jar = await cookies();
  const previewId = jar.get(PREVIEW_ID_COOKIE)?.value;
  if (!previewId) {
    return null;
  }
  return getResolvedPreview(
    previewId,
    jar.get(PREVIEW_VERSION_COOKIE)?.value ?? null,
    themeName,
    templateId
  );
}
