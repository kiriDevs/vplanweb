import Alert from "react-bootstrap/Alert";
import { Trans } from "react-i18next";
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
          <Trans ns="HomeScreen" i18nKey="requestFeedback.success" values={{ amount: props.feedback.entryCount }}>
            <strong>amount</strong>
          </Trans>
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
