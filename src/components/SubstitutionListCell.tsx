import { ListGroupItem } from "react-bootstrap";
import { FilterContextConsumer } from "../context/FilterContext";
import { Substitution } from "../types/Substitution";
import getRenderStyle from "../util/relevancyFilter";

interface ISubstitutionListCellProps {
  substitution: Substitution;
}

const renderSubstitute = (substitution: Substitution) => {
  switch (substitution.substitute) {
    case "EVA":
      return (
        <>
          Heute Eigenverantwortliches Arbeiten (<strong>EVA</strong>)
        </>
      );
    case "---":
      return "Findet heute nicht statt!";
    default:
      return "Heute bei " + substitution.substitute + " statt bei " + substitution.absent;
  }
};

const SubstitutionListCell = (props: ISubstitutionListCellProps) => (
  <FilterContextConsumer>
    {(filterOptions) => {
      const renderStyle = getRenderStyle(props.substitution, filterOptions);
      let styleVariant = "";
      switch (renderStyle) {
        case "partial":
          styleVariant = "secondary";
          break;
        case "full":
          styleVariant = "primary";
          break;
      }

      return (
        <ListGroupItem variant={styleVariant}>
          <>
            <strong>
              {props.substitution.class}: {props.substitution.subject} ({props.substitution.room})
            </strong>
            <br />
            {renderSubstitute(props.substitution)}

            {props.substitution.note !== "" && (
              <>
                <br />
                {props.substitution.note}
              </>
            )}
          </>
        </ListGroupItem>
      );
    }}
  </FilterContextConsumer>
);

export default SubstitutionListCell;
