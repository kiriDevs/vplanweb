import { useEffect, useState } from "react";
import { Form, ListGroup, Button, Stack, ButtonGroup } from "react-bootstrap";

import "../styles/settings.css";
import handleInputChange from "../util/handleInputChange";

interface ISettingsScreenProps {
  dismiss: () => void;
  resetStorage: () => void;
  currentStorageSchemeVersion: string;
}

const SettingsScreen = (props: ISettingsScreenProps) => {
  const [authInput, setAuthInput] = useState(window.localStorage.getItem("auth.token") ?? "");

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
      </ListGroup>

      <ButtonGroup id="settingsResetButtonContainer">
        <Button id="settingsResetButton" onClick={handleResetSettingsButtonClick} variant="danger">
          Reset Settings
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SettingsScreen;
