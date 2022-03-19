import APISubstitution from "./APISubstitution";

type APIResponse = {
  date: string;
  entries: APISubstitution[];
  code: number;
  message: string;
};

export default APIResponse;
