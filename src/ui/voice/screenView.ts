/**
 * Screen-view state detection for ordinal safety.
 *
 * The agent resolves "the second one" against its loaded working set, whose order
 * equals the DEFAULT fetch order of a collection / search page. That's correct until
 * the shopper uses the SITE's OWN controls to change the view — an on-page filter,
 * a sort, or pagination — which reorders/replaces the visible grid WITHOUT changing
 * the working set. After that, position numbers no longer match what's on screen, so
 * acting on a position could open/add the WRONG product.
 *
 * `isModifiedListingView` detects that state so the agent can fall back to resolving
 * by NAME instead of position. It is deliberately MERCHANT-AGNOSTIC: it never parses
 * a merchant's facet/sort key names (those differ per store) — it only checks whether
 * any MEANINGFUL query param exists beyond the base. Voice-driven navigation always
 * produces clean base URLs (`/collections/<handle>`, `<searchPath>?q=…`), so a
 * meaningful param can only come from the shopper's own on-page controls.
 */

// Universal ad / analytics params that appear on landing URLs but are NOT filters —
// they must NOT count as a "modified view" (else arriving via an ad link would wrongly
// disable positional references). These names are platform-universal, not per-merchant.
const TRACKING_PARAM =
  /^(utm_|gclid$|dclid$|gclsrc$|gad_|gbraid$|wbraid$|fbclid$|ttclid$|msclkid$|yclid$|igshid$|mc_|_gl$|ref$|source$|campaign$|srsltid$|_pos$|_sid$|_ss$|_psq$|_v$|epik$|twclid$|li_fat_id$|irclickid$|awc$)/i;

/**
 * True when a collection or search page is in a shopper-modified view (on-page
 * filter / sort / pagination active), meaning positional references are unreliable.
 * `search` is the raw query string (e.g. `window.location.search`). Non-listing pages
 * always return false.
 */
export function isModifiedListingView(
  pathname: string,
  search: string,
  searchPath: string
): boolean {
  const onCollection = pathname.startsWith("/collections/");
  const onSearch = !!searchPath && pathname.startsWith(searchPath);
  if (!onCollection && !onSearch) {
    return false;
  }
  const params = new URLSearchParams(search || "");
  let modified = false;
  params.forEach((_value, key) => {
    if (modified) {
      return;
    }
    if (key === "q") {
      return; // the search term is the base, not a modification
    }
    if (TRACKING_PARAM.test(key)) {
      return; // ad / analytics params are not on-page filters
    }
    modified = true; // a genuine filter / sort / paginate param → modified view
  });
  return modified;
}
