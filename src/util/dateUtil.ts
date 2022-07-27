import DateFormatter from "./DateFormatter";

export const isWeekend = (date: Date) => {
  const sanitized = DateFormatter.sanitize(date);

  if ([5, 6].includes(sanitized.weekDay)) {
    return true;
  }
};

export const getNextSchooldays = (amount: number) => {
  let genOptions = [];
  let itDate = new Date();

  while (genOptions.length < amount) {
    if (!isWeekend(itDate)) {
      genOptions.push(new Date(itDate));
    }

    itDate.setDate(itDate.getDate() + 1);
  }

  return genOptions;
};
