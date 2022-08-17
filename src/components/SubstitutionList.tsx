import { useEffect, useState, useContext } from "react";
import { Accordion } from "react-bootstrap";
import { Substitution } from "../types/Substitution";

import SubstitutionListGroup from "./SubstitutionListGroup";
import getRenderStyle from "../util/relevancyFilter";
import FilterContext from "../context/FilterContext";

interface ISubstitutionListProps {
  substitutions: Substitution[];
}

const SubstitutionList = (props: ISubstitutionListProps) => {
  const [periods, setPeriods] = useState([] as number[]);
  const [relevantEntries, setRelevantEntries] = useState([] as Substitution[]);

  const filterOptions = useContext(FilterContext);

  useEffect(() => {
    const _relevantEntries = [] as Substitution[];
    const _periods = [] as number[];
    props.substitutions.forEach((substitution: Substitution) => {
      if (getRenderStyle(substitution, filterOptions)) {
        _relevantEntries.push(substitution);
        if (!_periods.includes(substitution.period)) {
          _periods.push(substitution.period);
        }
      }
    });

    setRelevantEntries(_relevantEntries);
    setPeriods(_periods);
  }, [props.substitutions, filterOptions]);

  return relevantEntries.length !== 0 ? (
    <Accordion
      defaultActiveKey={periods.map((period) => `#-mobile-accordion-section${period.toString()}}`)}
      alwaysOpen
      flush
    >
      {periods.map((period) => (
        <SubstitutionListGroup
          key={`#-mobile-accordion-section${period.toString()}`}
          period={period}
          substitutions={relevantEntries.filter((substitution: Substitution) => substitution.period === period)}
        />
      ))}
    </Accordion>
  ) : (
    <></>
  );
};

export default SubstitutionList;
