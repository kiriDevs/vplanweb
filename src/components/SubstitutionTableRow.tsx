import { Substitution } from "../types/Substitution";

interface ISubstitutionTableRowProps {
  substitution: Substitution;
  style: "full" | "partial" | "normal" | false;
}

const SubstitutionTableRow = (props: ISubstitutionTableRowProps) => {
  const classes = [] as string[];
  if (props.style !== "normal") {
    classes.push("text-black");
    switch (props.style) {
      case "partial":
        classes.push("alert-dark");
        break;
      case "full":
        classes.push("alert-primary");
        break;
    }
  }

  return (
    <tr className={classes.join(" ")}>
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
