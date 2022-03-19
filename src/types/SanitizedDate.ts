type SanitizedDate = {
  raw: Date;
  rawDay: number;
  rawMonth: number;
  rawYear: number;

  day: string;
  month: string;
  shortYear: string;
};

export default SanitizedDate;
