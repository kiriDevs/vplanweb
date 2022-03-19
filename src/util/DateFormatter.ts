import SanitizedDate from "../types/SanitizedDate";

interface IDateFormatter {
  sanitize: (date: Date) => SanitizedDate;
  apiDateString: (date: Date | SanitizedDate) => string;
}

const DateFormatter: IDateFormatter = {
  sanitize: (date: Date) => {
    const ret: SanitizedDate = {
      raw: date,

      rawDay: date.getDate(),
      rawMonth: date.getMonth() + 1,
      rawYear: date.getFullYear()
    } as SanitizedDate;

    ret.day = ret.rawDay < 10 ? `0${ret.rawDay}` : ret.rawDay.toString();
    ret.month = ret.rawMonth < 10 ? `0${ret.rawMonth}` : ret.rawMonth.toString();
    ret.shortYear = ret.rawYear.toString().slice(2, 4);

    return ret;
  },
  apiDateString: (date: Date | SanitizedDate) => {
    if (date instanceof Date) {
      const sanitized = DateFormatter.sanitize(date);
      return DateFormatter.apiDateString(sanitized);
    }

    return `${date.day}.${date.month}.${date.shortYear}`;
  }
};

export default DateFormatter;
