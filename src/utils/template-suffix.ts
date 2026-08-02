/**
 * Page Templates — resolve the template suffix assigned to a product/collection.
 *
 * The suffix is read off the resource object returned by the commerce client
 * (`template_suffix`). Admin/commerce owns *writing* this field; the storefront
 * only consumes it here. Returns `undefined` when unassigned or "default" so the
 * builder resolves the default template. A non-default suffix whose template
 * doesn't exist still falls back to default in the resolver — this never errors.
 *
 * Single source of truth for "which template does this resource use": if
 * assignment ever moves behind a dedicated API, change only this function.
 */
export function getResourceTemplateSuffix(
  resource:
    | { template_suffix?: string | null; templateSuffix?: string | null }
    | null
    | undefined
): string | undefined {
  try {
    const raw = resource?.template_suffix ?? resource?.templateSuffix ?? null;
    const suffix = typeof raw === "string" ? raw.trim().toLowerCase() : "";
    // Empty / whitespace / "default" all mean "use the default template".
    return suffix && suffix !== "default" ? suffix : undefined;
  } catch {
    // Never let a malformed resource break rendering — no suffix ⇒ default.
    return undefined;
  }
}
