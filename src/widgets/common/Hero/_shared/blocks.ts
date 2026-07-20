/**
 * Normalize a content block to the canonical `{ id, type, settings }` shape.
 *
 * Supports two authoring styles so the editor (flat objectArray) and existing
 * nested locale data both work:
 *   - nested:  { type: "text", settings: { text, type_preset } }
 *   - flat:    { type: "text", text, type_preset }
 *
 * Flat blocks have their fields lifted into `settings` (everything except
 * `id`/`type`). Nested blocks are returned unchanged. Non-objects pass through.
 */
export function normalizeBlock<T extends { type?: string }>(block: T): T {
  if (!block || typeof block !== "object") {
    return block;
  }
  const b = block as {
    id?: string;
    type?: string;
    settings?: unknown;
  } & Record<string, unknown>;
  if (b.settings) {
    return block;
  }
  const { id, type, ...rest } = b;
  return { id, type, settings: rest } as unknown as T;
}
