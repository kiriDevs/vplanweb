import { Substitution } from "../types/Substitution";

interface IRelevancyFilterOptions {
  class: string;
  subjects: string[];
  filterMode: {
    filtering: boolean;
    ignoringSubjects: boolean;
  };
}

const isRelevant = (substitution: Substitution, options: IRelevancyFilterOptions) => {
  if (substitution.class === options.class) {
    return options.subjects.includes(substitution.subject) ? true : "partial";
  } else {
    return false;
  }
};

const getRenderStyle = (substitution: Substitution, options: IRelevancyFilterOptions) => {
  const relevancy = isRelevant(substitution, options); // true, "partial", false

  switch (relevancy) {
    case false:
      return options.filterMode.filtering ? false : "normal";
    case "partial":
      const ignoreSubjects = options.filterMode.ignoringSubjects || options.subjects.length === 0;
      console.log(options.filterMode.ignoringSubjects, options.subjects.length, ignoreSubjects);
      if (!options.filterMode.filtering) {
        if (!ignoreSubjects) {
          return "partial";
        } else {
          return "full";
        }
      } else {
        return ignoreSubjects && "normal";
      }
    case true:
      if (options.filterMode.filtering) {
        return options.filterMode.ignoringSubjects ? "full" : "normal";
      } else {
        return "full";
      }
  }

  // => false, "normal", "partial", "full"
};

export default getRenderStyle;
export { isRelevant };
export type { IRelevancyFilterOptions };
