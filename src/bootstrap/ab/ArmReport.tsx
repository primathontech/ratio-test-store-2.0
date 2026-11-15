import type { ArmContext } from "./index";
import { ArmSync } from "./ArmSync";

/**
 * Publishes the A/B dimensions the analytics readers consume.
 *
 * Two halves, because a page is read at two different moments:
 *
 *   the inline script — server-rendered, so the values are baked into the cached
 *     HTML and are already there for anything that runs before React hydrates:
 *     `beforeInteractive` scripts, the tag-manager container, early pixels.
 *     ArmSync alone emits nothing on the server, so on a cold load every one of
 *     those readers recorded the shopper as being in no test.
 *
 *   <ArmSync> — client-side, for what the script cannot do: updating on a
 *     navigation (no new document, so no new script) and CLEARING the values on
 *     a page no experiment covers.
 *
 * ArmSync renders unconditionally, including with no report — that absence is
 * what clears a previous page's values.
 */
export function ArmReport({ report }: { report?: ArmContext["report"] }) {
  // `<` escaped because this lands inside a <script>: the values come from the
  // backend, and a templateKey containing "</script>" would otherwise close the
  // tag early and let the rest of the string parse as markup.
  const json = report ? JSON.stringify(report).replace(/</g, "\\u003c") : null;

  return (
    <>
      {json !== null && (
        <script
          id="ab-report"
          dangerouslySetInnerHTML={{ __html: `window.__ab=${json}` }}
        />
      )}
      <ArmSync report={report} />
    </>
  );
}
