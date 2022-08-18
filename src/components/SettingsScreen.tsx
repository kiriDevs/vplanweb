import { useEffect, useState, useContext, SyntheticEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import { AiFillDelete, AiOutlinePlus, AiOutlineExclamation } from "react-icons/ai";
import { shared as StorageManager, CURRENT_LOCALSTORAGE_SCHEMA_VERSION } from "../util/StorageManager";

import "../styles/settings.css";
import { handleInputChange } from "../util/handleInputChange";
import { Trans, useTranslation } from "react-i18next";
import LanguagePicker from "./LanguagePicker";
import RESTContext from "../services/rest/RESTContext";

interface ISettingsScreenProps {
  dismiss: () => void;
}

const SettingsScreen = (props: ISettingsScreenProps) => {
  const [authInput, setAuthInput] = useState(window.localStorage.getItem("auth.token") ?? "");

  const [classInput, setClassInput] = useState(window.localStorage.getItem("filter.class") ?? "");
  const [subjectsInput, setSubjectsInput] = useState(
    JSON.parse(window.localStorage.getItem("filter.subjects") ?? "[]")
  );

  const rest = useContext(RESTContext);

  const { t } = useTranslation("SettingsScreen");
  const { t: tc } = useTranslation("common");

  useEffect(() => {
    const oldTitle = document.title;
    document.title = "VPlan | " + t("title");

    // Return a clean up function to return the title to the old state
    return () => {
      document.title = oldTitle;
    };
  });

  const saveSettings = () => {
    window.localStorage.setItem("storage.ls.version", CURRENT_LOCALSTORAGE_SCHEMA_VERSION);

    window.localStorage.setItem("auth.token", authInput);
    rest.setToken(authInput);

    window.localStorage.setItem("filter.class", classInput);
    window.localStorage.setItem(
      "filter.subjects",
      JSON.stringify(subjectsInput.filter((v: string) => v.trim() !== ""))
    );

    props.dismiss();
  };

  const handleResetSettingsButtonClick = () => {
    const confirmation = window.confirm(t("reset.confirmation"));
    if (confirmation) {
      StorageManager.initialize();
      updateInputFields();
    }
  };

  const updateInputFields = () => {
    setAuthInput(window.localStorage.getItem("auth.token") ?? "");
    setClassInput(window.localStorage.getItem("filter.class") ?? "");
  };

  const setSubjectInputValue = (index: number) =>
    handleInputChange((newValue: string) => {
      const newSubjectsInput = [...subjectsInput];
      newSubjectsInput[index] = newValue;
      setSubjectsInput(newSubjectsInput);
    });

  const handleSubjectDeleteButtonClick = (index: number) => () => {
    setSubjectsInput(subjectsInput.filter((_: string, inx: number) => inx !== index));
  };

  useEffect(() => {
    const escListener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        saveSettings();
      }
    };

    document.addEventListener("keydown", escListener);
    return () => {
      document.removeEventListener("keydown", escListener);
    };
  });

  return (
    <>
      <h1 className="vplan-heading">{t("title")}</h1>

      <Stack className="vplan-menustrip" direction="horizontal">
        <Button onClick={saveSettings} variant="primary">
          {tc("actions.save")}
        </Button>
        <Button onClick={props.dismiss} variant="secondary" className="ms-auto">
          {tc("actions.cancel")}
        </Button>
      </Stack>

      <ListGroup>
        <ListGroup.Item>
          <Stack direction="horizontal">
            <p className="my-auto">{t("languagePicker.label")}</p>
            <LanguagePicker className="ms-auto" />
          </Stack>
        </ListGroup.Item>

        <ListGroup.Item>
          <Form.Group>
            <Form.Label>{t("authEntry.label")}</Form.Label>
            <Form.Control
              plaintext={false}
              type="password"
              value={authInput}
              placeholder="TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA=" // "Never gonna give you up"
              onChange={handleInputChange(setAuthInput)}
            />
            <Form.Text>{t("authEntry.description")}</Form.Text>
          </Form.Group>
        </ListGroup.Item>

        <ListGroup.Item>
          <Form.Group>
            <Form.Label>{t("classEntry.label")}</Form.Label>
            <Form.Control
              plaintext={false}
              type="text"
              value={classInput}
              placeholder="9a / EFb / Q1"
              onChange={handleInputChange(setClassInput)}
            />
          </Form.Group>
        </ListGroup.Item>

        <ListGroup.Item>
          <p>
            {t("subjectsList.title")} ({subjectsInput.length})
          </p>
          <Form
            onSubmit={(e) => {
              // Do absolutely nothing
              e.preventDefault();
            }}
          >
            <Stack direction="vertical" gap={3}>
              {subjectsInput.map((value: string, index: number) => (
                <Form.Group>
                  <InputGroup>
                    <Form.Control
                      plaintext={false}
                      type="text"
                      value={subjectsInput[index]}
                      placeholder="E1 / erB / CH"
                      onChange={setSubjectInputValue(index)}
                    />
                    <Button variant="danger" onClick={handleSubjectDeleteButtonClick(index)}>
                      <AiFillDelete />
                    </Button>
                  </InputGroup>
                </Form.Group>
              ))}

              <Button
                onClick={() => {
                  const newSubjectsInput = [...subjectsInput];
                  newSubjectsInput.push("");
                  setSubjectsInput(newSubjectsInput);
                }}
              >
                <AiOutlinePlus /> {t("subjectsList.add")}
              </Button>

              <Alert variant="secondary">
                <strong>{t("subjectsList.note.main.title") + ":"}</strong> {t("subjectsList.note.main.text")}
                <br />
                <br />
                <strong>{t("subjectsList.note.example.title") + ":"}</strong>{" "}
                <Trans
                  ns="SettingsScreen"
                  i18nKey="subjectsList.note.example.text"
                  values={{ right: "SW/WI", wrong: "SW" }}
                >
                  <code>SW/WI</code>
                  <code>SW</code>
                </Trans>
              </Alert>
            </Stack>
          </Form>
        </ListGroup.Item>
      </ListGroup>

      <ButtonGroup id="settingsResetButtonContainer">
        <Button id="settingsResetButton" onClick={handleResetSettingsButtonClick} variant="danger">
          <AiOutlineExclamation /> {t("reset.buttonLabel")}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SettingsScreen;
