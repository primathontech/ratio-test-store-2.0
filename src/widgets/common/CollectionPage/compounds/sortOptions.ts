export const sortOptions = [
  // TODO: This will be enable when the BE is intergate
  // { id: "featured", label: "Featured", value: "MANUAL", order: "asc" },
  // {
  //   id: "best-selling",
  //   label: "Best selling",
  //   value: "BEST_SELLING",
  //   order: "asc",
  // },
  {
    id: "name-asc",
    label: "Alphabetically, A-Z",
    value: "title_asc",
    order: "asc",
  },
  {
    id: "name-desc",
    label: "Alphabetically, Z-A",
    value: "title_desc",
    order: "desc",
  },
  {
    id: "price-asc",
    label: "Price, low to high",
    value: "price_asc",
    order: "asc",
  },
  {
    id: "price-desc",
    label: "Price, high to low",
    value: "price_desc",
    order: "desc",
  },
  {
    id: "oldest",
    label: "Date, new to old",
    value: "date_asc",
    order: "asc",
  },
  {
    id: "newest",
    label: "Date, old to new",
    value: "date_desc",
    order: "desc",
  },
];
