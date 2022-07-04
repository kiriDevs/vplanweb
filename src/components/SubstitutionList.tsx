import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { Substitution } from "../types/Substitution";

import SubstitutionListGroup from "./SubstitutionListGroup";

interface ISubstitutionListProps {
  substitutions: Substitution[];
}

const SubstitutionList = (props: ISubstitutionListProps) => {
  const [periods, setPeriods] = useState([] as number[]);

  useEffect(() => {
    const _periods = [] as number[];
    props.substitutions.forEach((substitution: Substitution) => {
      if (!_periods.includes(substitution.period)) {
        _periods.push(substitution.period);
      }
    });
    setPeriods(_periods);
  }, [props.substitutions]);

  return (
    <Accordion
      defaultActiveKey={periods.map((period) => `#-mobile-accordion-section${period.toString()}}`)}
      alwaysOpen
      flush
    >
      {periods.map((period) => (
        <SubstitutionListGroup
          period={period}
          substitutions={props.substitutions.filter((substitution: Substitution) => substitution.period === period)}
        />
      ))}
    </Accordion>
  );
};

export default SubstitutionList;
