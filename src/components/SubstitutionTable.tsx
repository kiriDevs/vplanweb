import { useState } from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import { Substitution } from "../types/Substitution";
import SubstitutionTableRow from "./SubstitutionTableRow";
import getRenderStyle, { IRelevancyFilterOptions } from "../util/relevancyFilter";

interface ISubstitutionTableProps {
  substitutions: Substitution[];
  relevantOnly: boolean;
  ignoreSubjects: boolean;
}

const SubstitutionTable = (props: ISubstitutionTableProps) => {
  const [filterClass] = useState(window.localStorage.getItem("filter.class")!);
  const [filterSubjects] = useState(JSON.parse(window.localStorage.getItem("filter.subjects")!));

  const { t } = useTranslation("HomeScreen", { keyPrefix: "substitutionTable" });

  const filterOptions = {
    class: filterClass,
    subjects: filterSubjects,
    filterMode: {
      filtering: props.relevantOnly,
      ignoringSubjects: props.ignoreSubjects
    }
  };

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
