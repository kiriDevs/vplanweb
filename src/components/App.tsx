import { useEffect, useState, Dispatch, SetStateAction } from "react";

import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import { shared as StorageManager } from "../util/StorageManager";

import { Substitution } from "../types/Substitution";

import "../styles/general.css";

const App = () => {
  const [showingSettings, showSettings] = useState(false);
  const [renderedSubstitutions, renderSubstitutions] = useState([]);

  useEffect(() => {
    document.title = "VPlan | Home";
    StorageManager.startup();
  }, []);

  return showingSettings ? (
    <SettingsScreen
      dismiss={() => {
        showSettings(false);
      }}
    />
  ) : (
    <HomeScreen
      showSettings={() => {
        showSettings(true);
      }}
      renderedSubstitutions={renderedSubstitutions}
      renderSubstitutions={renderSubstitutions as Dispatch<SetStateAction<Substitution[]>>}
    />
  );
};

export default App;
