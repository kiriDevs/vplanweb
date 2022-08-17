import { APIError } from "../types/api/APIError";
import { Substitution } from "../types/Substitution";
import { handleCheckboxChange } from "../util/handleInputChange";
import SubstitutionTable from "./SubstitutionTable";
import { IoSend } from "react-icons/io5";
import RequestFeedbackAlert from "./RequestFeedbackAlert";
import RequestFeedback from "../types/RequestFeedback";
import { useState, Dispatch, SetStateAction, useEffect, useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import DatePicker from "./DatePicker";
import { getNextSchooldays } from "../util/dateUtil";
import DateFormatter from "../util/DateFormatter";
import RESTContext from "../services/rest/RESTContext";
import Alert from "react-bootstrap/Alert";

import { Button, Form, ListGroup, Spinner, Stack } from "react-bootstrap";
import { FilterContextProvider } from "../context/FilterContext";
import SubstitutionList from "./SubstitutionList";
import { IRelevancyFilterOptions } from "../util/relevancyFilter";

interface IHomeScreenProps {
  showSettings: () => void;
}

const HomeScreen = (props: IHomeScreenProps) => {
  const [loading, setLoading] = useState(true);

  const [dateOptions, setDateOptions] = useState([] as Date[]);
  const [data, setData] = useState({} as { [key: string]: Substitution[] | APIError });
  const [selection, select] = useState(new Date());

  const [requestFeedback, setRequestFeedback] = useState({ type: "none" } as RequestFeedback);
  const [filteringRelevant, filterRelevant] = useState(JSON.parse(window.localStorage.getItem("filter") ?? "false"));
  const [ignoringSubjects, ignoreSubjects] = useState(
    JSON.parse(window.localStorage.getItem("filter.ignoreSubjects")!)
  );

  const [usingMobileUi, useMobileUi] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const resizeListener = () => {
      useMobileUi(window.innerWidth <= 500);
    };

    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  const rest = useContext(RESTContext);
  const { t } = useTranslation("HomeScreen");
  const { t: tc } = useTranslation("common");

  const selectString = DateFormatter.apiDateString(selection);

  useEffect(() => {
    setDateOptions(getNextSchooldays(3));
  }, []);

  useEffect(() => {
    dateOptions.forEach((option: Date) => {
      const dateString = DateFormatter.apiDateString(option);

      rest
        .fetchPlan(option)
        .then((entries: Substitution[]) => {
          setData((old) => ({ ...old, [dateString]: entries }));
        })
        .catch((err: APIError) => {
          setData((old) => ({ ...old, [dateString]: err }));
        })
        .then(() => {
          if (dateString === selectString) {
            setLoading(false);
          }
        });
    });
  }, [dateOptions, rest]); // eslint-disable-line react-hooks/exhaustive-deps
  // ^^^ Ignored dependency warning for selectString, since we do not want to re-fetch whenever selection changes

  useEffect(() => {
    if (loading) {
      document.title = "VPlan | " + tc("loading");
    } else {
      document.title = "VPlan | " + t("title");
    }
  }, [loading, tc, t]);

  const makeRequest = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setRequestFeedback({ type: "none" });

    rest
      .fetchPlan(selection)
      .then((entries: Substitution[]) => {
        setData((old) => ({ ...old, [selectString]: entries }));
        setRequestFeedback({ type: "success", entryCount: entries.length });
      })
      .catch((err: APIError) => {
        setRequestFeedback({ type: "error", error: err });
      })
      .then(() => {
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
                    setRequestFeedback({ type: "none" });
                    select(newValue);
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
          {!data[selectString] ? (
            <Spinner animation="border" />
          ) : ["status", "message", "description"].every((a) => a in data[selectString]) ? (
            <Alert variant="danger">
              <h1>{(data[selectString] as APIError).message}</h1>
              {(data[selectString] as APIError).description}
            </Alert>
          ) : (
            <FilterContextProvider value={filterOptions}>
              {usingMobileUi ? (
                <SubstitutionList substitutions={data[DateFormatter.apiDateString(selection)] as Substitution[]} />
              ) : (
                <SubstitutionTable substitutions={data[DateFormatter.apiDateString(selection)] as Substitution[]} />
              )}
            </FilterContextProvider>
          )}
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
