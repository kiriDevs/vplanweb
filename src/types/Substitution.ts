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

const fromAPI = (api: APISubstitution): Substitution => ({
  ...api,
  period: parseInt(api.subject)
});

export default Substitution;
