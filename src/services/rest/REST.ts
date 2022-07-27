import axios, { AxiosError, AxiosResponse } from "axios";
import { makeApiErrorFromAxiosError } from "../../types/api/APIError";
import APIResponse from "../../types/api/APIResponse";
import APISubstitution from "../../types/api/APISubstitution";
import { makeSubstitutionFromAPI, Substitution } from "../../types/Substitution";
import DateFormatter from "../../util/DateFormatter";

const DEFAULT_API_URL = "https://api.chuangsheep.com/vplan";

type IRESTOptions = {
  url: string;
  token: string;
};

interface IREST {
  settings: IRESTOptions;
  setToken: (newValue: string) => void;
  setUrl: (newValue: string) => void;
  fetchPlan: (forDate: Date) => Promise<Substitution[]>;
}

const REST = class implements IREST {
  settings: IRESTOptions;

  constructor(token: string, url: string = DEFAULT_API_URL) {
    this.settings = { url: url, token: token };
  }

  setToken = (newValue: string) => {
    this.settings.token = newValue;
    return this;
  };

  setUrl = (newValue: string) => {
    this.settings.url = newValue;
    return this;
  };

  fetchPlan = (forDate: Date) => {
    return new Promise<Substitution[]>((resolve, reject) => {
      const requestedDate = DateFormatter.apiDateString(forDate);
      axios
        .get(this.settings.url, {
          params: {
            date: requestedDate
          },
          headers: {
            Authorization: "Bearer " + this.settings.token
          }
        })
        .then((res: AxiosResponse<APIResponse>) => {
          resolve(res.data.entries.map((entry: APISubstitution) => makeSubstitutionFromAPI(entry)));
        })
        .catch((err: AxiosError) => {
          reject(makeApiErrorFromAxiosError(err));
        });
    });
  };
};

export default REST;
