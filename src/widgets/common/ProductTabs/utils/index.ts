/**
 * ProductTabs — data normalization utilities.
 *
 * Direct port of the bblunt project's
 * `src/widgets/bblunt/ProductDetailTabSection/utils/index.tsx` model:
 *
 *   • `html`  — description rendered as HTML (always first when present).
 *   • `cards` — at least one card has an imageUrl → image + title + text.
 *   • `list`  — no images → plain title + text per item.
 *
 * No handle-prefix matching: any new tab the admin adds is classified
 * automatically by the shape of its content.
 */

import type { ApiProductDetailTab } from "@/widgets/common/ProductDetail/types";
import {
  ensureArray,
  getFirstValue,
} from "@/widgets/common/AdditionalInformation/utils/getAdditionalInfoItems";

/* ------------------------------------------------------------------ */
/*  Normalized tab model                                               */
/* ------------------------------------------------------------------ */

export interface NormalizedCard {
  title: string;
  text: string;
  imageUrl: string;
}

export type NormalizedTab =
  | { title: string; type: "html"; html: string }
  | { title: string; type: "cards"; cards: NormalizedCard[] }
  | { title: string; type: "list"; cards: NormalizedCard[] };

/* ------------------------------------------------------------------ */
/*  Transform                                                          */
/* ------------------------------------------------------------------ */

/**
 * Convert the raw `product_details` metafield into a list of
 * normalized tabs.  Mirrors `transformProductDetailsData` in the
 * legacy bblunt project.
 */
export function transformProductDetailsData(
  apiTabs: ApiProductDetailTab[] | unknown,
  description?: string
): NormalizedTab[] {
  const tabs: NormalizedTab[] = [];

  if (description && description.trim()) {
    tabs.push({ title: "Description", type: "html", html: description });
  }

  const nodes = ensureArray<any>(apiTabs);
  for (const tab of nodes) {
    const fields = tab?.fields || {};
    const title = getFirstValue(fields.tab_title?.value) || "";
    const contentItems = ensureArray<any>(fields.tab_content?.value);

    const cards: NormalizedCard[] = contentItems.map((card) => {
      const cardFields = card?.fields || {};
      return {
        title: getFirstValue(cardFields.title?.value) ?? "",
        text: getFirstValue(cardFields.content?.value) ?? "",
        imageUrl: getFirstValue(cardFields.image?.value) ?? "",
      };
    });

    const hasImages = cards.some((c) => c.imageUrl);
    tabs.push({
      title,
      type: hasImages ? "cards" : "list",
      cards,
    });
  }

  return tabs;
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

/**
 * Drop tabs without a title or with all-empty content.
 */
export function filterValidTabs(tabs: NormalizedTab[]): NormalizedTab[] {
  return tabs.filter((tab) => {
    if (!tab.title || tab.title.trim() === "") {
      return false;
    }
    if (tab.type === "html") {
      return !!tab.html && tab.html.trim() !== "";
    }
    if (!tab.cards || tab.cards.length === 0) {
      return false;
    }
    return tab.cards.some(
      (c) =>
        (c.title && c.title.trim() !== "") ||
        (c.text && c.text.trim() !== "") ||
        (tab.type === "cards" && c.imageUrl && c.imageUrl.trim() !== "")
    );
  });
}
