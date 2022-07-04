import axios from "axios";
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

import { Button, Form, ListGroup, Spinner, Stack } from "react-bootstrap";
import { FilterContextProvider } from "../context/FilterContext";
import SubstitutionList from "./SubstitutionList";
import { IRelevancyFilterOptions } from "../util/relevancyFilter";

interface IHomeScreenProps {
  showSettings: () => void;
}

const HomeScreen = (props: IHomeScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [renderedSubstitutions, renderSubstitutions] = useState([]);

  const [date, setDate] = useState(new Date());
  const [requestFeedback, setRequestFeedback] = useState({ type: "none" } as RequestFeedback);
  const [filteringRelevant, filterRelevant] = useState(JSON.parse(window.localStorage.getItem("filter") ?? "false"));
  const [ignoringSubjects, ignoreSubjects] = useState(
    JSON.parse(window.localStorage.getItem("filter.ignoreSubjects")!)
  );

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
        params: { date: DateFormatter.apiDateString(date) },
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
        document.title = "VPlan | " + res.data.date;
      })
      .catch((err) => {
        setRequestFeedback({ type: "error", error: makeApiErrorFromAxiosError(err) });
        setLoading(false);
      });
  };

  const handleFilterSwitch = (newValue: boolean) => {
    if (newValue === false) {
      ignoreSubjects(false);
    }

    filterRelevant(newValue);
    window.localStorage.setItem("filter", JSON.stringify(newValue));
  };

  const handleIgnoreSubjectsSwitch = (newValue: boolean) => {
    ignoreSubjects(newValue);
    window.localStorage.setItem("filter.ignoreSubjects", JSON.stringify(newValue));
  };

  const [filterClass] = useState(window.localStorage.getItem("filter.class")!);
  const [filterSubjects] = useState(JSON.parse(window.localStorage.getItem("filter.subjects")!));
  const filterOptions = {
    class: filterClass,
    subjects: filterSubjects,
    filterMode: {
      filtering: filteringRelevant,
      ignoringSubjects: ignoringSubjects
    }
  } as IRelevancyFilterOptions;

  const useMobileUi = window.innerWidth <= 500;

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
                  select={(newValue) => {
                    setDate(newValue);
                  }}
                  maxDays={3}
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
            {filteringRelevant && JSON.parse(window.localStorage.getItem("filter.subjects")!).length > 0 && (
              <Form.Switch
                label={t("ignoreSubjectsToggle.description")}
                checked={ignoringSubjects}
                onChange={handleCheckboxChange(handleIgnoreSubjectsSwitch)}
              />
            )}
          </Form>

          <RequestFeedbackAlert
            dismiss={() => {
              setRequestFeedback({ type: "none" });
            }}
            feedback={requestFeedback}
          />
        </ListGroup.Item>

        <ListGroup.Item>
          <FilterContextProvider value={filterOptions}>
            {useMobileUi ? (
              <SubstitutionList substitutions={renderedSubstitutions} />
            ) : (
              <SubstitutionTable
                substitutions={renderedSubstitutions}
                relevantOnly={filteringRelevant}
                ignoreSubjects={ignoringSubjects}
              />
            )}
          </FilterContextProvider>
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
