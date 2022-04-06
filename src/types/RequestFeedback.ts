import { APIError } from "./api/APIError";

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
