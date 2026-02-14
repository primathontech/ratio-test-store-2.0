// types.ts

// Enum for tab types
export enum TabContentType {
  HTML = "html",
  LIST = "list",
  CARDS = "cards",
}

export const PRODUCT_DETAILS_METAFIELD_KEY = "product_details";

export interface ProductDetailTab {
  title: string;
  type: TabContentType;
  content: string | string[] | { text: string; imageUrl?: string }[];
}

export function transformProductDetailsData(
  metaObject: any,
  descriptionHtml?: string
): ProductDetailTab[] {
  const tabs: ProductDetailTab[] = [];

  // Add description tab FIRST
  if (descriptionHtml) {
    tabs.push({
      title: "Description",
      type: TabContentType.HTML,
      content: descriptionHtml,
    });
  }

  // NEW FORMAT: metaObject.product_details.value is an array of tabs
  const tabNodes = metaObject?.value || [];

  tabNodes.forEach((tab: any) => {
    const fields = tab?.fields || {};

    const title = fields?.tab_title?.value?.[0] || "";

    // NEW FORMAT: tab_content.value is array of card references
    const contentItems = fields?.tab_content?.value || [];

    const cards = contentItems.map((item: any) => {
      // const card = item?.value; // <-- inside "value" we have the real metaobject card

      if (!item?.fields) return { text: "", imageUrl: null };

      const cardTitle = item?.fields?.title?.value?.[0];
      const content = item.fields?.content?.value?.[0] || "";
      const imageArr = item.fields?.image?.value || [];
      const imageUrl = Array.isArray(imageArr) ? imageArr[0] : null;

      return {
        cardTitle,
        text: content,
        imageUrl,
      };
    });

    const hasImages = cards.some((c: any) => c.imageUrl);

    tabs.push({
      title,
      type: hasImages ? TabContentType.CARDS : TabContentType.LIST,
      content: hasImages ? cards : cards.map((c: any) => c.text),
    });
  });

  return tabs;
}
