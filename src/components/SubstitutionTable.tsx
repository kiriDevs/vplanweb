import Table from "react-bootstrap/Table";
import { Substitution } from "../types/Substitution";
import SubstitutionTableRow from "./SubstitutionTableRow";

interface ISubstitutionTableProps {
  substitutions: Substitution[];
}

const SubstitutionTable = (props: ISubstitutionTableProps) => {
  const isRelevant = (substitution: Substitution) => {
    return (
      substitution.class === window.localStorage.getItem("filter.class") &&
      JSON.parse(window.localStorage.getItem("filter.subjects") ?? "[]").includes(substitution.subject)
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
        {props.substitutions.map((substitution: Substitution) => (
          <SubstitutionTableRow
            key={`#-st-str-${substitution.period}${substitution.absent}`}
            substitution={substitution}
            highlighted={isRelevant(substitution)}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default SubstitutionTable;
