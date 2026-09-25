import type { PageConfig } from "@shopkit/builder";
import { DATA_SOURCE_TYPES } from "@shopkit/builder";

/**
 * Home B Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-home-b",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [],
};
