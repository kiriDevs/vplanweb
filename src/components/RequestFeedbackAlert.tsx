import Alert from "react-bootstrap/Alert";
import RequestFeedback from "../types/RequestFeedback";

interface IRequestFeedbackAlertProps {
  dismiss: () => void;
  feedback: RequestFeedback;
}

const RequestFeedbackAlert = (props: IRequestFeedbackAlertProps) => {
  if (props.feedback.type === "none") {
    return <></>;
  }

  return (
    <>
      <br />
      <Alert
        variant={props.feedback.type === "error" ? "danger" : props.feedback.type}
        dismissible
        onClose={props.dismiss}
      >
        {props.feedback.type === "success" ? (
          <span>
            Successfully fetched <strong>{props.feedback.entryCount}</strong> entries.
          </span>
        ) : (
          <>
            <Alert.Heading>{props.feedback.error.message}</Alert.Heading>
            {props.feedback.error.description}
          </>
        )}
      </Alert>
    </>
  );
};

export default RequestFeedbackAlert;
