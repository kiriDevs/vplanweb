import APISubstitution from "./api/APISubstitution";

type Substitution = {
  period: number;
  substitute: string;
  subject: string;
  absent: string;
  class: string;
  room: string;
  note: string;
};

const makeSubstitutionFromAPI = (api: APISubstitution): Substitution => ({
  ...api,
  period: parseInt(api.period)
});

export { type Substitution, makeSubstitutionFromAPI };
