import { useEffect, useState } from "react";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DateFormatter from "../util/DateFormatter";

interface IDatePickerProps {
  futureRange: number;
  select: (newValue: string) => void;
}

const DatePicker = (props: IDatePickerProps) => {
  const [options, setOptions] = useState([DateFormatter.apiDateString(new Date())]);
  const [selection, select] = useState(options[0]);

  useEffect(() => {
    let optionDates = [];
    for (let i = 0; i <= props.futureRange; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      optionDates.push(date);
    }
    setOptions(optionDates.map((date: Date) => DateFormatter.apiDateString(date)));
  }, [props.futureRange]);

  return (
    <DropdownButton title={selection + " "} variant="secondary">
      {options.map((option: string) => (
        <DropdownItem
          key={`#-hs-datedd/o-${option}`}
          onClick={() => {
            select(option);
            props.select(option);
          }}
        >
          {option}
        </DropdownItem>
      ))}
    </DropdownButton>
  );
};

export default DatePicker;
