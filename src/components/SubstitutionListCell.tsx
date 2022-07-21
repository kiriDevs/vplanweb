import { ListGroupItem } from "react-bootstrap";
import { TFunction, Trans, useTranslation } from "react-i18next";
import { FilterContextConsumer } from "../context/FilterContext";
import { Substitution } from "../types/Substitution";
import getRenderStyle from "../util/relevancyFilter";

interface ISubstitutionListCellProps {
  substitution: Substitution;
}

const renderSubstitute = (substitution: Substitution, t: TFunction) => {
  switch (substitution.substitute) {
    case "EVA":
      return (
        <Trans t={t} i18nKey="subTexts.eva">
          <strong>EVA</strong>
        </Trans>
      );
    case "---":
      return t("subTexts.nosub");
    default:
      return (
        <Trans
          t={t}
          i18nKey="subTexts.sub"
          values={{ substitute: substitution.substitute, absent: substitution.absent }}
        >
          <strong>{substitution.substitute}</strong>
          <strong>{substitution.absent}</strong>
        </Trans>
      );
  }
};

const SubstitutionListCell = (props: ISubstitutionListCellProps) => {
  const { t } = useTranslation("HomeScreen", { keyPrefix: "mobileui" });

  return (
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
              {renderSubstitute(props.substitution, t)}

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
};

export default SubstitutionListCell;
