import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import { Substitution } from "../types/Substitution";
import SubstitutionListCell from "./SubstitutionListCell";
import { Badge, ListGroupItem, Stack } from "react-bootstrap";
import getRenderStyle from "../util/relevancyFilter";
import { useContext, useEffect, useState, useTransition } from "react";
import FilterContext from "../context/FilterContext";
import { useTranslation } from "react-i18next";

type validOrInvalid = "valid" | "invalid";

const requiredSubstitutionFields = ["class", "subject", "substitute"];
const isValid = (substitution: Substitution) => {
  return requiredSubstitutionFields.every((requiredField) => substitution.hasOwnProperty(requiredField));
};
const validityFilter = (subs: Substitution[]) => {
  const valid = [] as Substitution[];
  const invalid = [] as Substitution[];

  subs.forEach((sub) => {
    if (isValid(sub)) {
      valid.push(sub);
    } else {
      invalid.push(sub);
    }
  });

  return { valid, invalid } as { [K in validOrInvalid]: Substitution[] };
};

interface ISubstitutionListGroupProps {
  period: number;
  substitutions: Substitution[];
}

const SubstitutionListGroup = (props: ISubstitutionListGroupProps) => {
  const filterOptions = useContext(FilterContext);

  const [partialMatchCount, setPartialMatchCount] = useState(0);
  const [fullMatchCount, setFullMatchCount] = useState(0);

  const [validEntries, setValidEntries] = useState([] as Substitution[]);
  const [invalidEntries, setInvalidEntries] = useState([] as Substitution[]);

  const { t: tc } = useTranslation("common");

  useEffect(() => {
    const { valid, invalid } = validityFilter(props.substitutions);
    setValidEntries(valid);
    setInvalidEntries(invalid);

    const fullMatches = props.substitutions.filter((sub) => getRenderStyle(sub, filterOptions) == "full");
    setFullMatchCount(fullMatches.length);

    const partialMatches = props.substitutions.filter((sub) => getRenderStyle(sub, filterOptions) == "partial");
    setPartialMatchCount(partialMatches.length);
  }, [props.substitutions]);

  return (
    <AccordionItem eventKey={`#-mobile-accordion-section${props.period.toString()}`} className="show">
      <AccordionHeader>
        <Stack direction="horizontal" className="w-100">
          <strong>{tc("nth-period", { replace: { n: props.period } })}</strong>
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

            {invalidEntries.length > 0 && (
              <Badge bg="danger" pill>
                {invalidEntries.length}
              </Badge>
            )}
          </Stack>
        </Stack>
      </AccordionHeader>
      <AccordionBody className="p-0">
        {validEntries.map((substitution: Substitution) => (
          <SubstitutionListCell
            substitution={substitution}
            key={`#-mobile-accordion-section${props.period.toString()}-${substitution.class}|${substitution.subject}`}
          />
        ))}

        {invalidEntries.length > 0 && (
          <ListGroupItem
            variant="danger"
            onClick={() => {
              alert(JSON.stringify(invalidEntries, undefined, 2));
            }}
          >
            <strong>+ {invalidEntries.length} invalid entries</strong>
            <br />
            <span>Tap to show raw data</span>
          </ListGroupItem>
        )}
      </AccordionBody>
    </AccordionItem>
  );
};

export default SubstitutionListGroup;
