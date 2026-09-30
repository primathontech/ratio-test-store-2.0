import { IFilter, IApplyFilter } from "../provider/type";

/**
 * Updates the filters array based on the filter action (ADD/REMOVE)
 */
export const updateFiltersArray = (
  currentFilters: IFilter[],
  payload: IApplyFilter
): IFilter[] => {
  const updatedFilters: IFilter[] = [...currentFilters];

  if (payload.filter.type === "LIST") {
    if (payload.type === "ADD") {
      const existingFilterIndex = updatedFilters.findIndex(
        (f) => f.id === payload.filter.id
      );
      if (existingFilterIndex >= 0) {
        const existingValues = updatedFilters[existingFilterIndex].values;
        const newValues = payload.filter.values.filter(
          (newValue) =>
            !existingValues.some((existing) => existing.id === newValue.id)
        );
        updatedFilters[existingFilterIndex].values =
          existingValues.concat(newValues);
      } else {
        updatedFilters.push(payload.filter);
      }
    } else if (payload.type === "REMOVE") {
      const existingFilterIndex = updatedFilters.findIndex(
        (f) => f.id === payload.filter.id
      );
      if (existingFilterIndex >= 0) {
        const valuesToRemove = new Set(payload.filter.values.map((v) => v.id));
        updatedFilters[existingFilterIndex].values = updatedFilters[
          existingFilterIndex
        ].values.filter(({ id }) => !valuesToRemove.has(id));

        if (updatedFilters[existingFilterIndex].values.length === 0) {
          updatedFilters.splice(existingFilterIndex, 1);
        }
      }
    }
  } else if (payload.filter.type === "PRICE_RANGE") {
    const existingFilterIndex = updatedFilters.findIndex(
      (f) => f.id === payload.filter.id
    );

    if (payload.value && payload.filter.values[0]) {
      const input = JSON.parse(payload.filter.values[0].input);
      input.price = payload.value;
      payload.filter.values[0].input = JSON.stringify(input);
    }

    if (existingFilterIndex >= 0) {
      updatedFilters[existingFilterIndex] = payload.filter;
    } else {
      updatedFilters.push(payload.filter);
    }
  }

  return updatedFilters;
};

/**
 * Creates filter parameters for API calls
 */
export const createFilterParams = (filters: IFilter[]): any[] => {
  return filters
    .flatMap((filter) => filter.values.map((value) => value.input))
    .map((v) => JSON.parse(v));
};
