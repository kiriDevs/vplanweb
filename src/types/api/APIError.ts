import { AxiosError } from "axios";

type APIError = {
  status: number;
  message: string;
  description: string;
};

const makeApiErrorFromAxiosError = (axiosError: AxiosError) =>
  ({
    status: axiosError.response?.status,
    message: axiosError.response?.data.message,
    description: axiosError.response?.data.description
  } as APIError);

export { type APIError, makeApiErrorFromAxiosError };
