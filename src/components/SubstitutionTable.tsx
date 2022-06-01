import { useState } from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import { Substitution } from "../types/Substitution";
import SubstitutionTableRow from "./SubstitutionTableRow";

interface ISubstitutionTableProps {
  substitutions: Substitution[];
  relevantOnly: boolean;
  ignoreSubjects: boolean;
}

const SubstitutionTable = (props: ISubstitutionTableProps) => {
  const [filterClass] = useState(window.localStorage.getItem("filter.class"));
  const [filterSubjects] = useState(JSON.parse(window.localStorage.getItem("filter.subjects")!));

  const { t } = useTranslation("HomeScreen", { keyPrefix: "substitutionTable" });

  const isRelevant = (substitution: Substitution) => {
    if (substitution.class === filterClass) {
      return filterSubjects.includes(substitution.subject) ? true : "partial";
    } else {
      return false;
    }
  };

  const getRenderStyle = (substitution: Substitution) => {
    const relevancy = isRelevant(substitution); // true, "partial", false

    switch (relevancy) {
      case false:
        return props.relevantOnly ? false : "normal";
      case "partial":
        if (props.relevantOnly) {
          return props.ignoreSubjects || filterSubjects.length == 0 ? "normal" : false;
        } else {
          return filterSubjects.length > 0 ? "partial" : "full";
        }
      case true:
        if (props.relevantOnly) {
          return props.ignoreSubjects ? "full" : "normal";
        } else {
          return "full";
        }
    }

    // => false, "normal", "partial", "full"
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
          .filter((substitution: Substitution) => getRenderStyle(substitution))
          .map((substitution: Substitution) => (
            <SubstitutionTableRow
              key={`#-st-str-${substitution.period}${substitution.absent}`}
              substitution={substitution}
              style={getRenderStyle(substitution)}
            />
          ))}
      </tbody>
    </Table>
  );
};

export default SubstitutionTable;
