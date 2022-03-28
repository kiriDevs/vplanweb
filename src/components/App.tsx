import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup, ListGroup, Spinner, Stack } from "react-bootstrap";
import { makeApiErrorFromAxiosError } from "../types/api/APIErrorResponse";
import APISubstitution from "../types/api/APISubstitution";
import { makeSubstitutionFromAPI, Substitution } from "../types/Substitution";
import DateFormatter from "../util/DateFormatter";
import { handleCheckoxChange, handleInputChange } from "../util/handleInputChange";
import SettingsScreen from "./SettingsScreen";
import SubstitutionTable from "./SubstitutionTable";
import { IoSend } from "react-icons/io5";
import RequestFeedbackAlert from "./RequestFeedbackAlert";
import RequestFeedback from "../types/RequestFeedback";

import "../styles/home.css";

const CURRENT_LOCALSTORAGE_SCHEMA_VERSION = "1.1";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [renderedSubstitutions, renderSubstitutions] = useState([]);

  const [date, setDate] = useState(DateFormatter.apiDateString(new Date()));
  const [requestFeedback, setRequestFeedback] = useState({ type: "none" } as RequestFeedback);
  const [filteringRelevant, filterRelevant] = useState(false);

  const [showingSettings, showSettings] = useState(false);

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
        renderSubstitutions(substitutions);
        setLoading(false);
        setRequestFeedback({ type: "success", entryCount: substitutions.length });
      })
      .catch((err) => {
        setRequestFeedback({ type: "error", error: makeApiErrorFromAxiosError(err) });
        setLoading(false);
      });
  };

  const initializeStorage = () => {
    window.localStorage.clear();
    window.localStorage.setItem("storage.ls.version", CURRENT_LOCALSTORAGE_SCHEMA_VERSION);
    window.localStorage.setItem("auth.token", "");
    window.localStorage.setItem("filter.class", "");
    window.localStorage.setItem("filter.subjects", JSON.stringify([]));
  };

  // Validating localStorage when the App component is mounted
  useEffect(() => {
    const storageVersion = window.localStorage.getItem("storage.ls.version");
    if (!storageVersion) {
      // No storage exists so far
      initializeStorage();
    } else if (storageVersion === CURRENT_LOCALSTORAGE_SCHEMA_VERSION) {
      // The storage is on the latest schema version - we're done here
      return;
    } else if (storageVersion === "1.0") {
      // YAAAY let's migrate from version 1.0
      window.localStorage.setItem("filter.class", "");
      window.localStorage.setItem("filter.subjects", JSON.stringify([]));

      window.localStorage.setItem("storage.ls.version", "1.1");
      alert("Your localStorage was migrated to a new schema version!");
    } else {
      alert(
        "Your localStorage is outdated and its version is no longer supported for migration. " +
          "Your localStorage will be re-initialized. You will have to re-configure the app. " +
          "Sorry for the inconvenience :c"
      );
      initializeStorage();
    }
  }, []);

  if (showingSettings) {
    return (
      <SettingsScreen
        dismiss={() => {
          showSettings(false);
        }}
        resetStorage={initializeStorage}
        currentStorageSchemeVersion={CURRENT_LOCALSTORAGE_SCHEMA_VERSION}
      />
    );
  }

  return (
    <>
      <h1 id="homeHeading">VPlan</h1>

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
                    showSettings(true);
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
              onChange={handleCheckoxChange(filterRelevant)}
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
          <SubstitutionTable substitutions={renderedSubstitutions} relevantOnly={filteringRelevant} />
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

export default App;
