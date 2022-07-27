import { createContext } from "react";
import { IRelevancyFilterOptions } from "../util/relevancyFilter";

const defaultValue = {
  class: "",
  subjects: [],
  filterMode: {
    filtering: false,
    ignoringSubjects: false
  }
} as IRelevancyFilterOptions;

const FilterContext = createContext(defaultValue);

export default FilterContext;
export const FilterContextProvider = FilterContext.Provider;
export const FilterContextConsumer = FilterContext.Consumer;
