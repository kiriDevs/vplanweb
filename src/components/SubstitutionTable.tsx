import Table from "react-bootstrap/Table";
import { Substitution } from "../types/Substitution";
import SubstitutionTableRow from "./SubstitutionTableRow";

interface ISubstitutionTableProps {
  substitutions: Substitution[];
  relevantOnly: boolean;
}

const SubstitutionTable = (props: ISubstitutionTableProps) => {
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
          <th>Period</th>
          <th>Substitute</th>
          <th>Subject</th>
          <th>Teacher</th>
          <th>Class</th>
          <th>Room</th>
          <th>Note</th>
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
