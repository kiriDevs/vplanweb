import { APIError } from "./api/APIErrorResponse";

type RequestFeedback =
  | {
      type: "success";
      entryCount: number;
    }
  | {
      type: "error";
      error: APIError;
    }
  | { type: "none" };

export default RequestFeedback;
