import Substitution from "../types/Substitution";

interface ISubstitutionTableRowProps {
  substitution: Substitution;
}

const SubstitutionTableRow = (props: ISubstitutionTableRowProps) => {
  return (
    <tr>
      <td>{props.substitution.period}</td>
      <td>{props.substitution.substitute}</td>
      <td>{props.substitution.subject}</td>
      <td>{props.substitution.absent}</td>
      <td>{props.substitution.class}</td>
      <td>{props.substitution.room}</td>
      <td>{props.substitution.note}</td>
    </tr>
  );
};

export default SubstitutionTableRow;
