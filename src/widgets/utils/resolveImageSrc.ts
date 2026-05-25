/**
 * Editor image fields store data as `{ src, alt }` objects (see CMS schema
 * guide — `type: "image"`). Templates may also pass plain string URLs for
 * backward compatibility. This helper normalizes both shapes into a single
 * URL string, falling back to a provided default when empty/missing.
 */
export type EditorImageValue = { src: string; alt: string } | string;

export function resolveImageSrc(
  value: EditorImageValue | undefined,
  fallback: string
): string {
  if (!value) {
    return fallback;
  }
  if (typeof value === "string") {
    return value || fallback;
  }
  return value.src || fallback;
}

/**
 * Like `resolveImageSrc`, but also returns the `alt` string if present.
 */
export function resolveImage(
  value: EditorImageValue | undefined,
  fallback: { src: string; alt?: string }
): { src: string; alt: string } {
  if (!value) {
    return { src: fallback.src, alt: fallback.alt ?? "" };
  }
  if (typeof value === "string") {
    return { src: value || fallback.src, alt: fallback.alt ?? "" };
  }
  return {
    src: value.src || fallback.src,
    alt: value.alt || fallback.alt || "",
  };
}
