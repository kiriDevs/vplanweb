import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Form, InputGroup, ListGroup, Spinner, Stack } from "react-bootstrap";
import { APIError, makeApiErrorFromAxiosError } from "../types/api/APIErrorResponse";
import APISubstitution from "../types/api/APISubstitution";
import { makeSubstitutionFromAPI } from "../types/Substitution";
import DateFormatter from "../util/DateFormatter";
import handleInputChange from "../util/handleInputChange";
import SettingsScreen from "./SettingsScreen";
import SubstitutionTable from "./SubstitutionTable";
import { IoSend } from "react-icons/io5";

import "../styles/home.css";

const CURRENT_LOCALSTORAGE_SCHEMA_VERSION = "1.0";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [renderedSubstitutions, renderSubstitutions] = useState([]);

  const [date, setDate] = useState(DateFormatter.apiDateString(new Date()));

  const [apiError, setApiError] = useState({} as APIError);
  const [apiErrored, setApiErrored] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);

  const [showingSettings, showSettings] = useState(false);

  const makeRequest = () => {
    if (loading) {
      return;
    }

    setApiErrored(false);
    setApiSuccess(false);
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
        setApiSuccess(true);
      })
      .catch((err) => {
        setApiError(makeApiErrorFromAxiosError(err));
        setApiErrored(true);
        setLoading(false);
      });
  };

  const initializeStorage = () => {
    window.localStorage.clear();
    window.localStorage.setItem("storage.ls.version", "1.0");
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
      /*
    } else if (storageVersion === "0.0") {
      alert("Your localStorage was migrated to a new schema version!");
    */
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
                  <InputGroup.Text onClick={makeRequest} className="bg-primary text-white">
                    {loading ? <Spinner animation="border" size="sm" /> : <IoSend />}
                  </InputGroup.Text>
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
          </Form>

          {apiErrored && (
            <>
              <br />
              <Alert
                variant="danger"
                onClose={() => {
                  setApiErrored(false);
                }}
                dismissible
              >
                <strong>{apiError.message}</strong>
                <br />
                {apiError.description}
              </Alert>
            </>
          )}
          {apiSuccess && (
            <>
              <br />
              <Alert
                variant="success"
                onClose={() => {
                  setApiSuccess(false);
                }}
                dismissible
              >
                Successfully fetched {renderedSubstitutions.length} entries.
              </Alert>
            </>
          )}
        </ListGroup.Item>

        <ListGroup.Item>
          <SubstitutionTable substitutions={renderedSubstitutions} />
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
