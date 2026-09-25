import type { PageConfig } from "@shopkit/builder";
import { DATA_SOURCE_TYPES } from "@shopkit/builder";

/**
 * Products B Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-products-b",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [],
};
