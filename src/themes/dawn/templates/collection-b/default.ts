import type { PageConfig } from "@shopkit/builder";
import { DATA_SOURCE_TYPES } from "@shopkit/builder";

/**
 * Collection B Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-collection-b",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [],
};
