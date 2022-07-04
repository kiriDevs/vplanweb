import { useEffect, useState, Dispatch, SetStateAction } from "react";

import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import { shared as StorageManager } from "../util/StorageManager";

import "../styles/general.css";

const App = () => {
  const [showingSettings, showSettings] = useState(false);

  useEffect(() => {
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
    />
  );
};

export default App;
