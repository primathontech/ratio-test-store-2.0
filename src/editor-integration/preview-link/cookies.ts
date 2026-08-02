/**
 * Shareable-preview cookie names.
 *
 * Kept in a dependency-free module so it can be imported from BOTH the edge
 * middleware and Node route handlers / the template loader without dragging in
 * `next/headers` or the resolver. Changing a name here keeps middleware, the
 * enter/exit handlers, the template loader, and PreviewExitBar in sync.
 */

/** httpOnly — the shareable preview id the loader resolves a snapshot from. */
export const PREVIEW_ID_COOKIE = "editorPreviewId";
/** httpOnly — pins a specific snapshot version (absent → latest). */
export const PREVIEW_VERSION_COOKIE = "editorPreviewVersion";
/** Non-httpOnly mirror flag the client "Exit preview" bar reads ("1"). */
export const PREVIEW_ACTIVE_COOKIE = "editorPreviewActive";
/**
 * httpOnly — forces a specific template variant/suffix while previewing. Value
 * is `"{type}:{suffix}"` (e.g. `"products:promo"`). Its cookie `path` is scoped
 * to the previewed resource's URL, so the browser only sends it for that exact
 * product/collection page — every other resource renders its default template.
 * The loader applies it only when `type` matches the route (so chrome isn't
 * forced). Absent for default-template previews.
 */
export const PREVIEW_SUFFIX_COOKIE = "editorPreviewSuffix";

/**
 * Public-facing origin (scheme + host) for building redirect targets.
 *
 * In production the Next server binds an internal address (e.g. 0.0.0.0:3000),
 * so `new URL(request.url).origin` inside a Route Handler is that INTERNAL
 * origin — redirecting to it sends the visitor to https://0.0.0.0:3000. The
 * real public host arrives via the proxy's `x-forwarded-host`/`-proto` headers;
 * prefer those, falling back to the Host header, then the request URL (local
 * dev, where there's no proxy). Web-standard `Request` only — keeps this module
 * dependency-free for edge + node use.
 */
export function publicOrigin(request: Request): string {
  const reqUrl = new URL(request.url);
  const host = (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    reqUrl.host
  )
    .split(",")[0]
    .trim();
  const proto = (
    request.headers.get("x-forwarded-proto") ?? reqUrl.protocol.replace(":", "")
  )
    .split(",")[0]
    .trim();
  return `${proto}://${host}`;
}
