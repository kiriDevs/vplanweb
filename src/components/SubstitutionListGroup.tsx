import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import { Substitution } from "../types/Substitution";
import SubstitutionListCell from "./SubstitutionListCell";

interface ISubstitutionListGroupProps {
  period: number;
  substitutions: Substitution[];
}

const SubstitutionListGroup = (props: ISubstitutionListGroupProps) => (
  <AccordionItem eventKey={`#-mobile-accordion-section${props.period.toString()}`} className="show">
    <AccordionHeader>
      <strong>{props.period}. Stunde</strong>
    </AccordionHeader>
    <AccordionBody className="p-0">
      {props.substitutions.map((substitution: Substitution) => (
        <SubstitutionListCell substitution={substitution} />
      ))}
    </AccordionBody>
  </AccordionItem>
);

export default SubstitutionListGroup;
