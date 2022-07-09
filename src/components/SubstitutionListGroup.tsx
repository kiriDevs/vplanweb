import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import { Substitution } from "../types/Substitution";
import SubstitutionListCell from "./SubstitutionListCell";
import { Badge, Stack } from "react-bootstrap";
import getRenderStyle from "../util/relevancyFilter";
import { useContext, useEffect, useState } from "react";
import FilterContext from "../context/FilterContext";

interface ISubstitutionListGroupProps {
  period: number;
  substitutions: Substitution[];
}

const SubstitutionListGroup = (props: ISubstitutionListGroupProps) => {
  const filterOptions = useContext(FilterContext);

  const [partialMatchCount, setPartialMatchCount] = useState(0);
  const [fullMatchCount, setFullMatchCount] = useState(0);

  useEffect(() => {
    const fullMatches = props.substitutions.filter((sub) => getRenderStyle(sub, filterOptions) == "full");
    setFullMatchCount(fullMatches.length);

    const partialMatches = props.substitutions.filter((sub) => getRenderStyle(sub, filterOptions) == "partial");
    setPartialMatchCount(partialMatches.length);
  }, [props.substitutions]);

  return (
    <AccordionItem eventKey={`#-mobile-accordion-section${props.period.toString()}`} className="show">
      <AccordionHeader>
        <Stack direction="horizontal" className="w-100">
          <strong>{props.period}. Stunde</strong>
          <Stack direction="horizontal" className="ms-auto" gap={1} style={{ paddingRight: "0.6em" }}>
            {partialMatchCount > 0 && (
              <Badge bg="secondary" pill>
                {partialMatchCount}
              </Badge>
            )}

            {fullMatchCount > 0 && (
              <Badge bg="primary" pill>
                {fullMatchCount}
              </Badge>
            )}
          </Stack>
        </Stack>
      </AccordionHeader>
      <AccordionBody className="p-0">
        {props.substitutions.map((substitution: Substitution) => (
          <SubstitutionListCell
            substitution={substitution}
            key={`#-mobile-accordion-section${props.period.toString()}-${substitution.class}|${substitution.subject}`}
          />
        ))}
      </AccordionBody>
    </AccordionItem>
  );
};

export default SubstitutionListGroup;
