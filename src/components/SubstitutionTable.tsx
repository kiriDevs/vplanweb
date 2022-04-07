import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import { Substitution } from "../types/Substitution";
import SubstitutionTableRow from "./SubstitutionTableRow";

interface ISubstitutionTableProps {
  substitutions: Substitution[];
  relevantOnly: boolean;
}

const SubstitutionTable = (props: ISubstitutionTableProps) => {
  const { t } = useTranslation("HomeScreen", { keyPrefix: "substitutionTable" });

  const isRelevant = (substitution: Substitution) => {
    const filterCourses = JSON.parse(window.localStorage.getItem("filter.subjects") ?? "[]");
    const filterClass = window.localStorage.getItem("filter.class");
    return (
      (substitution.class === filterClass && filterCourses.includes(substitution.subject)) ||
      (filterCourses.length === 0 && substitution.class === filterClass)
    );
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
          .filter((substitution: Substitution) => !props.relevantOnly || isRelevant(substitution))
          .map((substitution: Substitution) => (
            <SubstitutionTableRow
              key={`#-st-str-${substitution.period}${substitution.absent}`}
              substitution={substitution}
              highlighted={!props.relevantOnly && isRelevant(substitution)}
            />
          ))}
      </tbody>
    </Table>
  );
};

export default SubstitutionTable;
