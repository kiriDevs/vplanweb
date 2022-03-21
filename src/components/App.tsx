import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Form, ListGroup, Spinner, Stack } from "react-bootstrap";
import { APIError, makeApiErrorFromAxiosError } from "../types/api/APIErrorResponse";
import APISubstitution from "../types/api/APISubstitution";
import { makeSubstitutionFromAPI } from "../types/Substitution";
import DateFormatter from "../util/DateFormatter";
import SubstitutionTable from "./SubstitutionTable";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [renderedSubstitutions, renderSubstitutions] = useState([]);

  const [date, setDate] = useState(DateFormatter.apiDateString(new Date()));
  const [auth, setAuth] = useState(window.localStorage.getItem("auth.token") ?? "");

  const [apiError, setApiError] = useState({} as APIError);
  const [apiErrored, setApiErrored] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);

  // Save auth token whenever it is changed
  useEffect(() => {
    window.localStorage.setItem("auth.token", auth);
  }, [auth]);

  const makeRequest = () => {
    if (loading) {
      return;
    }

    setApiErrored(false);
    setLoading(true);
    axios
      .get("https://api.chuangsheep.com/vplan", {
        params: { date: date },
        headers: {
          Authorization: `Bearer ${auth}`
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

  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.currentTarget.value);
  };

  const handleAuthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.currentTarget.value);
  };

  return (
    <>
      <ListGroup>
        <ListGroup.Item>
          <Form>
            <Stack direction="horizontal" gap={5}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control type="text" placeholder="21.03.22" onChange={handleDateInputChange} value={date} />
                <Form.Text>The date to request the VPlan for</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Auth</Form.Label>
                <Form.Control
                  plaintext={false}
                  placeholder="TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA="
                  onChange={handleAuthInputChange}
                  value={auth}
                />
                <Form.Text>You can get an AuthToken for the API from ChuangSheep!</Form.Text>
              </Form.Group>

              <div className="vr ms-auto" />
              <Spinner animation="border" size="sm" hidden={!loading} />
              <Button onClick={makeRequest}>Request</Button>
            </Stack>
          </Form>

          {apiErrored && (
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
          )}
          {apiSuccess && (
            <Alert
              variant="success"
              onClose={() => {
                setApiSuccess(false);
              }}
              dismissible
            >
              Successfully fetched {renderedSubstitutions.length} entries.
            </Alert>
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
