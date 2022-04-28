import { useEffect, useState } from "react";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DateFormatter from "../util/DateFormatter";
import { isWeekend } from "../util/dateUtil";

interface IDatePickerProps {
  select: (newValue: Date) => void;
  maxDays: number;
}

const DatePicker = (props: IDatePickerProps) => {
  const [options, setOptions] = useState([new Date()]);
  const [selection, select] = useState(options[0]);

  useEffect(() => {
    let options = [];
    let itDate = new Date();

    while (options.length < props.maxDays) {
      console.log(itDate);
      if (!isWeekend(itDate)) {
        options.push(new Date(itDate));
      }

      itDate.setDate(itDate.getDate() + 1);
    }

    setOptions(options);
  }, [props.maxDays]);

  return (
    <DropdownButton title={DateFormatter.apiDateString(selection) + " "} variant="outline-dark">
      {options.map((option: Date) => (
        <DropdownItem
          key={`#-hs-datedd/o-${option}`}
          onClick={() => {
            select(option);
            props.select(option);
          }}
        >
          {DateFormatter.apiDateString(option)}
        </DropdownItem>
      ))}
    </DropdownButton>
  );
};

export default DatePicker;
