import { IFilter, ISort } from "../provider/type";

/**
 * URL updater utility using window.history.replaceState to avoid re-renders
 */
export const createUrlUpdater = () => {
  return (params: URLSearchParams) => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.search = "";

    params.forEach((value, key) => {
      if (value && value !== "") {
        url.searchParams.append(key, value);
      }
    });

    window.history.replaceState({}, "", url.toString());
  };
};

export const createUrlSearchParams = (
  filters: IFilter[],
  sort?: ISort
): URLSearchParams => {
  const urlParams = new URLSearchParams();

  filters.forEach((filter) => {
    if (filter.type === "PRICE_RANGE") {
      const input = JSON.parse(filter.values[0].input);
      urlParams.append(`${filter.id}.gte`, String(input.price.min));
      urlParams.append(`${filter.id}.lte`, String(input.price.max));
    } else if (filter.type === "LIST" && filter.values.length > 0) {
      filter.values.forEach((value) => {
        urlParams.append(filter.id, value.label);
      });
    }
  });

  if (sort) {
    urlParams.append("sort_by", sort.value.toLowerCase());
    urlParams.append("ascending", sort.order === "asc" ? "true" : "false");
  }

  return urlParams;
};
