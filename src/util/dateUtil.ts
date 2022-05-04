import DateFormatter from "./DateFormatter";

export const isWeekend = (date: Date) => {
  const sanitized = DateFormatter.sanitize(date);

  if ([5, 6].includes(sanitized.weekDay)) {
    return true;
  }
};
