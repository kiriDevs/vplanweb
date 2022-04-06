import { useEffect, useState, Dispatch, SetStateAction } from "react";

import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";

import { Substitution } from "../types/Substitution"

import "../styles/home.css";

const CURRENT_LOCALSTORAGE_SCHEMA_VERSION = "1.2";

const App = () => {
  const [showingSettings, showSettings] = useState(false);
  const [renderedSubstitutions, renderSubstitutions] = useState([]);

  const initializeStorage = () => {
    window.localStorage.clear();
    window.localStorage.setItem("storage.ls.version", CURRENT_LOCALSTORAGE_SCHEMA_VERSION);
    window.localStorage.setItem("auth.token", "");
    window.localStorage.setItem("filter.class", "");
    window.localStorage.setItem("filter.subjects", JSON.stringify([]));
    window.localStorage.setItem("filter", JSON.stringify(false));
  };

  // Validating localStorage when the App component is mounted
  useEffect(() => {
    const storageVersion = window.localStorage.getItem("storage.ls.version");
    if (!storageVersion) {
      // No storage exists so far
      initializeStorage();
    } else if (storageVersion === CURRENT_LOCALSTORAGE_SCHEMA_VERSION) {
      // The storage is on the latest schema version - we're done here
      return;
    } else if (storageVersion === "1.0") {
      // YAAAY let's migrate from version 1.0
      window.localStorage.setItem("filter.class", "");
      window.localStorage.setItem("filter.subjects", JSON.stringify([]));
      window.localStorage.setItem("filter", JSON.stringify(false));

      window.localStorage.setItem("storage.ls.version", "1.2");
      alert("Your localStorage was migrated to a new schema version!");
    } else if (storageVersion === "1.1") {
      // Migrate from version 1.1
      window.localStorage.setItem("filter", JSON.stringify(false));

      window.localStorage.setItem("storage.ls.version", "1.2");
      alert("Your localStorage was migrated to a new schema version!");
    } else {
      alert(
        "Your localStorage is outdated and its version is no longer supported for migration. " +
          "Your localStorage will be re-initialized. You will have to re-configure the app. " +
          "Sorry for the inconvenience :c"
      );
      initializeStorage();
    }
  }, []);

  return showingSettings ? (
    <SettingsScreen
      dismiss={() => {
        showSettings(false);
      }}
      resetStorage={initializeStorage}
      currentStorageSchemeVersion={CURRENT_LOCALSTORAGE_SCHEMA_VERSION}
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
