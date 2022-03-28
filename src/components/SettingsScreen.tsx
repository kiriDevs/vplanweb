import { useEffect, useState } from "react";
import { Form, ListGroup, Button, Stack, ButtonGroup, InputGroup, Alert } from "react-bootstrap";
import { AiFillDelete, AiOutlinePlus, AiOutlineExclamation } from "react-icons/ai";

import "../styles/settings.css";
import handleInputChange from "../util/handleInputChange";

interface ISettingsScreenProps {
  dismiss: () => void;
  resetStorage: () => void;
  currentStorageSchemeVersion: string;
}

const SettingsScreen = (props: ISettingsScreenProps) => {
  const [authInput, setAuthInput] = useState(window.localStorage.getItem("auth.token") ?? "");

  const [classInput, setClassInput] = useState(window.localStorage.getItem("filter.class") ?? "");
  const [subjectsInput, setSubjectsInput] = useState(
    JSON.parse(window.localStorage.getItem("filter.subjects") ?? "[]")
  );

  useEffect(() => {
    document.title = "VPlan | Settings";
  });

  const saveSettings = () => {
    window.localStorage.setItem("storage.ls.version", props.currentStorageSchemeVersion);

    window.localStorage.setItem("auth.token", authInput);
    window.localStorage.setItem("filter.class", classInput);
    window.localStorage.setItem("filter.subjects", JSON.stringify(subjectsInput.filter((v: string) => v !== "")));

    props.dismiss();
  };

  const handleResetSettingsButtonClick = () => {
    const confirmation = window.confirm("Are you sure you want to remove all settings?");
    if (confirmation) {
      props.resetStorage();
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

  return (
    <>
      <h1 id="settingsHeading">Settings</h1>

      <Stack id="settingsMenuStrip" direction="horizontal">
        <Button onClick={saveSettings} variant="primary">
          Save
        </Button>
        <Button onClick={props.dismiss} variant="secondary" className="ms-auto">
          Cancel
        </Button>
      </Stack>

      <ListGroup>
        <ListGroup.Item>
          <Form.Group>
            <Form.Label>Authorization Token</Form.Label>
            <Form.Control
              plaintext={false}
              type="password"
              value={authInput}
              placeholder="TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA=" // "Never gonna give you up"
              onChange={handleInputChange(setAuthInput)}
            />
            <Form.Text>The token used to authenticate with the external API.</Form.Text>
          </Form.Group>
        </ListGroup.Item>

        <ListGroup.Item>
          <Form.Group>
            <Form.Label>Your class</Form.Label>
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
          <p>Your subjects</p>
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
                <AiOutlinePlus /> Add another subject
              </Button>

              <Alert variant="secondary">
                <strong>Note:</strong> Make sure to enter your subjects with the name that they appear with on the
                substitution plans of the school. In some cases, this representation might differ from what's listed on
                the timetable or the course choice lists.
                <br />
                <br />
                <strong>Example:</strong> <code>SW/WI</code> instead of <code>SW</code>
              </Alert>
            </Stack>
          </Form>
        </ListGroup.Item>
      </ListGroup>

      <ButtonGroup id="settingsResetButtonContainer">
        <Button id="settingsResetButton" onClick={handleResetSettingsButtonClick} variant="danger">
          <AiOutlineExclamation /> Reset Settings
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SettingsScreen;
