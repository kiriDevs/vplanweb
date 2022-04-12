import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Stack from "react-bootstrap/Stack";
import { makeApiErrorFromAxiosError } from "../types/api/APIError";
import APISubstitution from "../types/api/APISubstitution";
import { makeSubstitutionFromAPI, Substitution } from "../types/Substitution";
import { handleCheckboxChange } from "../util/handleInputChange";
import SubstitutionTable from "./SubstitutionTable";
import { IoSend } from "react-icons/io5";
import RequestFeedbackAlert from "./RequestFeedbackAlert";
import RequestFeedback from "../types/RequestFeedback";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import DateFormatter from "../util/DateFormatter";
import { Trans, useTranslation } from "react-i18next";
import DatePicker from "./DatePicker";

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

  const { t } = useTranslation("HomeScreen");
  const { t: tc } = useTranslation("common");

  useEffect(() => {
    document.title = "VPlan | " + t("title");
  });

  useEffect(() => {
    if (loading) {
      document.title = "VPlan | " + tc("loading");
    }
  }, [loading, tc]);

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
        document.title = "VPlan | " + res.data.date;
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
              <Form.Label>{t("dateEntry.label")}</Form.Label>
              <Stack direction="horizontal" gap={3}>
                <DatePicker
                  futureRange={3}
                  select={(newValue) => {
                    setDate(newValue);
                  }}
                />

                {loading ? (
                  <Button disabled={true}>
                    <Spinner animation="border" size="sm" />
                  </Button>
                ) : (
                  <Button disabled={false} onClick={makeRequest}>
                    <IoSend />
                  </Button>
                )}

                <Button
                  onClick={() => {
                    props.showSettings();
                  }}
                  variant="secondary"
                  className="ms-auto"
                >
                  {tc("navigation.settings")}
                </Button>
              </Stack>
              <Form.Text>{t("dateEntry.description")}</Form.Text>
            </Form.Group>
            <br />
            <Form.Switch
              label={t("filterToggle.description")}
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
              <Trans ns="HomeScreen" i18nKey="footer.copyright" values={{ maintainer: "kiriDevs", year: 2022 }}>
                <a href="https://kiriDevs.de">kiriDevs</a>
                <a href="https://kiridevs.de/vplanweb/contributors">contributors</a>
              </Trans>
              <br />
              <Trans ns="HomeScreen" i18nKey="footer.github">
                <a href="https://kiridevs.de/vplanweb">on GitHub</a>
              </Trans>
            </p>
          </Stack>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default HomeScreen;
