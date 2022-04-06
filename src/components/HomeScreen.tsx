import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Stack from "react-bootstrap/Stack";
import { makeApiErrorFromAxiosError } from "../types/api/APIErrorResponse";
import APISubstitution from "../types/api/APISubstitution";
import { makeSubstitutionFromAPI, Substitution } from "../types/Substitution";
import { handleCheckboxChange, handleInputChange } from "../util/handleInputChange";
import SubstitutionTable from "./SubstitutionTable";
import { IoSend } from "react-icons/io5";
import RequestFeedbackAlert from "./RequestFeedbackAlert";
import RequestFeedback from "../types/RequestFeedback";
import { useState, Dispatch, SetStateAction } from "react";
import DateFormatter from "../util/DateFormatter";

import "../styles/home.css";

interface IHomeScreenProps {
  showSettings: () => void;
  renderedSubstitutions: Substitution[];
  renderSubstitutions: Dispatch<SetStateAction<Substitution[]>>;
}

const HomeScreen = (props: IHomeScreenProps) => {
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(DateFormatter.apiDateString(new Date()));
  const [requestFeedback, setRequestFeedback] = useState({ type: "none" } as RequestFeedback);
  const [filteringRelevant, filterRelevant] = useState(JSON.parse(window.localStorage.getItem("filter") ?? "false"));

  const makeRequest = () => {
    if (loading) {
      return;
    }

    setRequestFeedback({ type: "none" });
    setLoading(true);
    axios
      .get("https://api.chuangsheep.com/vplan", {
        params: { date: date },
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("auth.token")}`
        }
      })
      .then((res) => {
        const substitutions = res.data.entries.map((entry: APISubstitution) => {
          const substitution = makeSubstitutionFromAPI(entry);
          return substitution;
        });
        props.renderSubstitutions(substitutions);
        setLoading(false);
        setRequestFeedback({ type: "success", entryCount: substitutions.length });
      })
      .catch((err) => {
        setRequestFeedback({ type: "error", error: makeApiErrorFromAxiosError(err) });
        setLoading(false);
      });
  };

  const handleFilterSwitch = (newValue: boolean) => {
    filterRelevant(newValue);
    window.localStorage.setItem("filter", JSON.stringify(newValue));
  };

  return (
    <>
      <h1 className="vplan-heading">VPlan</h1>

      <ListGroup>
        <ListGroup.Item>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              makeRequest();
            }}
          >
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Stack direction="horizontal" gap={3}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder={DateFormatter.apiDateString(new Date())}
                    onChange={handleInputChange(setDate)}
                    value={date}
                  />
                  {loading ? (
                    <InputGroup.Text className="bg-secondary text-white">
                      <Spinner animation="border" size="sm" />
                    </InputGroup.Text>
                  ) : (
                    <InputGroup.Text onClick={makeRequest} className="bg-primary text-white">
                      <IoSend />
                    </InputGroup.Text>
                  )}
                </InputGroup>

                <Button
                  onClick={() => {
                    props.showSettings();
                  }}
                  variant="secondary"
                >
                  Settings
                </Button>
              </Stack>
              <Form.Text>The date to request the VPlan for</Form.Text>
            </Form.Group>
            <br />
            <Form.Switch
              label="Only display relevant entries"
              checked={filteringRelevant}
              onChange={handleCheckboxChange(handleFilterSwitch)}
            />
          </Form>

          <RequestFeedbackAlert
            dismiss={() => {
              setRequestFeedback({ type: "none" });
            }}
            feedback={requestFeedback}
          />
        </ListGroup.Item>

        <ListGroup.Item>
          <SubstitutionTable substitutions={props.renderedSubstitutions} relevantOnly={filteringRelevant} />
        </ListGroup.Item>

        <ListGroup.Item>
          <Stack>
            <p>
              (C) <a href="https://kiridevs.de">kiriDevs</a> and{" "}
              <a href="https://kiridevs.de/vplanweb/contributors">contributors</a> 2022.
              <br />
              Developed open-source <a href="https://kiridevs.de/vplanweb">on GitHub</a>!
            </p>
          </Stack>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default HomeScreen;
