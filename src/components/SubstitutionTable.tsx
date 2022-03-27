import Table from "react-bootstrap/Table";
import { Substitution } from "../types/Substitution";
import SubstitutionTableRow from "./SubstitutionTableRow";

interface ISubstitutionTableProps {
  substitutions: Substitution[];
}

const SubstitutionTable = (props: ISubstitutionTableProps) => (
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
          highlighted={false}
        />
      ))}
    </tbody>
  </Table>
);

export default SubstitutionTable;
