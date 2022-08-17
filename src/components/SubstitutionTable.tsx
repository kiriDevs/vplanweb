import { useContext } from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import { Substitution } from "../types/Substitution";
import SubstitutionTableRow from "./SubstitutionTableRow";
import getRenderStyle from "../util/relevancyFilter";
import FilterContext from "../context/FilterContext";

interface ISubstitutionTableProps {
  substitutions: Substitution[];
}

const SubstitutionTable = (props: ISubstitutionTableProps) => {
  const filterOptions = useContext(FilterContext);
  const { t } = useTranslation("HomeScreen", { keyPrefix: "substitutionTable" });

  return (
    <Table>
      <thead>
        <tr>
          <th>{t("columnLabels.period")}</th>
          <th>{t("columnLabels.substitute")}</th>
          <th>{t("columnLabels.subject")}</th>
          <th>{t("columnLabels.teacher")}</th>
          <th>{t("columnLabels.class")}</th>
          <th>{t("columnLabels.room")}</th>
          <th>{t("columnLabels.note")}</th>
        </tr>
      </thead>
      <tbody>
        {props.substitutions
          .map((substitution: Substitution) => {
            const style = getRenderStyle(substitution, filterOptions);
            return (
              <SubstitutionTableRow
                key={`#-st-str-${substitution.period}${substitution.absent}`}
                substitution={substitution}
                style={style}
              />
            );
          })
          .filter((elem: JSX.Element | undefined) => elem && elem.props.style !== false)}
      </tbody>
    </Table>
  );
};

export default SubstitutionTable;
