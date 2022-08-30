import { useEffect, useState } from "react";

import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import { shared as StorageManager } from "../util/StorageManager";

import REST from "../services/rest/REST";
import RESTContext from "../services/rest/RESTContext";

import "../styles/general.css";

const App = () => {
  const [showingSettings, showSettings] = useState(false);

  useEffect(() => {
    StorageManager.startup();
  }, []);

  return (
    <>
      <RESTContext.Provider value={new REST(window.localStorage.getItem("auth.token") || "")}>
        {showingSettings ? (
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
        )}
      </RESTContext.Provider>
    </>
  );
};

export default App;
